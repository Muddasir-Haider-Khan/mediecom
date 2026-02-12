import { db } from "./db";
import { Order } from "@prisma/client";

export interface LeopardShipmentPayload {
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  recipientAddress: string;
  recipientCity: string;
  recipientPostalCode?: string;
  pieces: number;
  weight: number;
  itemDescription: string;
  itemValue: number;
  cod?: number; // Cash on Delivery amount
  orderReference?: string;
}

export interface LeopardTrackingResponse {
  trackingNumber: string;
  status: string;
  location?: string;
  lastUpdate?: string;
  estimatedDelivery?: string;
  events: Array<{
    timestamp: string;
    status: string;
    message: string;
    location?: string;
  }>;
}

interface LeopardApiError extends Error {
  statusCode?: number;
  response?: any;
}

export class LeopardService {
  private static apiBaseUrl = "https://api.leopardcourier.com/v1";

  /**
   * Get Leopard configuration from database
   */
  static async getConfig() {
    try {
      const config = await db.leopardConfig.findFirst();
      if (!config || !config.isEnabled) {
        throw new Error("Leopard is not configured or disabled");
      }
      return config;
    } catch (error) {
      console.error("Failed to fetch Leopard config:", error);
      throw error;
    }
  }

  /**
   * Create a shipment in Leopard
   */
  static async createShipment(
    orderId: string,
    payload: LeopardShipmentPayload
  ): Promise<any> {
    try {
      const config = await this.getConfig();
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } }, user: true },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Prepare shipment creation request
      const shipmentRequest = {
        hub_id: config.hubId,
        recipient_name: payload.recipientName,
        recipient_phone: payload.recipientPhone,
        recipient_email: payload.recipientEmail || order.user?.email,
        recipient_address: payload.recipientAddress,
        recipient_city: payload.recipientCity,
        recipient_postal_code: payload.recipientPostalCode || "90000",
        pieces: payload.pieces || 1,
        weight: payload.weight,
        item_description: payload.itemDescription,
        item_value: payload.itemValue,
        cod: payload.cod || 0,
        reference: payload.orderReference || order.orderNumber,
        instructions: order.notes || "",
      };

      // Call Leopard API
      const response = await this.makeRequest("POST", "/shipments", shipmentRequest, config);

      if (!response.shipment_id || !response.tracking_number) {
        throw new Error("Invalid response from Leopard API");
      }

      // Store shipment in database
      const shipment = await db.leopardShipment.create({
        data: {
          shipmentId: response.shipment_id,
          trackingNumber: response.tracking_number,
          status: "CREATED",
          labelUrl: response.label_url || null,
          weight: payload.weight,
          orderId,
          lastStatusUpdate: new Date(),
        },
      });

      // Create initial tracking record
      await db.deliveryTracking.create({
        data: {
          orderId,
          status: "CREATED",
          message: `Shipment created with Leopard. Tracking #: ${response.tracking_number}`,
          source: "LEOPARD",
        },
      });

      console.log(`✅ Leopard shipment created: ${response.tracking_number}`);
      return shipment;
    } catch (error) {
      console.error("Failed to create Leopard shipment:", error);
      const message = error instanceof Error ? error.message : "Unknown error";

      // Log error to shipment record if it exists
      const existingShipment = await db.leopardShipment.findUnique({
        where: { orderId },
      }).catch(() => null);

      if (existingShipment) {
        await db.leopardShipment.update({
          where: { orderId },
          data: { errorMessage: message, retryCount: existingShipment.retryCount + 1 },
        });
      }

      throw error;
    }
  }

  /**
   * Track a shipment
   */
  static async trackShipment(trackingNumber: string): Promise<LeopardTrackingResponse> {
    try {
      const config = await this.getConfig();
      const response = await this.makeRequest(
        "GET",
        `/shipments/track/${trackingNumber}`,
        undefined,
        config
      );

      if (!response.tracking_number) {
        throw new Error("Invalid response from Leopard API");
      }

      return {
        trackingNumber: response.tracking_number,
        status: response.status,
        location: response.current_location,
        lastUpdate: response.last_update,
        estimatedDelivery: response.estimated_delivery,
        events: response.events || [],
      };
    } catch (error) {
      console.error("Failed to track shipment:", error);
      throw error;
    }
  }

  /**
   * Get label URL for a shipment
   */
  static async getLabel(shipmentId: string): Promise<string> {
    try {
      const config = await this.getConfig();
      const response = await this.makeRequest(
        "GET",
        `/shipments/${shipmentId}/label`,
        undefined,
        config
      );

      if (!response.label_url) {
        throw new Error("No label URL in response");
      }

      return response.label_url;
    } catch (error) {
      console.error("Failed to get label:", error);
      throw error;
    }
  }

  /**
   * Calculate shipping rate
   */
  static async calculateRate(
    fromCity: string,
    toCity: string,
    weight: number,
    itemValue: number
  ): Promise<{ rate: number; currency: string; estimatedDays: number }> {
    try {
      const config = await this.getConfig();
      const response = await this.makeRequest(
        "POST",
        "/rates/calculate",
        {
          from_city: fromCity,
          to_city: toCity,
          weight,
          item_value: itemValue,
        },
        config
      );

      return {
        rate: response.rate,
        currency: response.currency || "PKR",
        estimatedDays: response.estimated_delivery_days || 2,
      };
    } catch (error) {
      console.error("Failed to calculate rate:", error);
      throw error;
    }
  }

  /**
   * Cancel a shipment
   */
  static async cancelShipment(shipmentId: string): Promise<{ success: boolean }> {
    try {
      const config = await this.getConfig();
      const response = await this.makeRequest(
        "POST",
        `/shipments/${shipmentId}/cancel`,
        {},
        config
      );

      // Update shipment status in database
      await db.leopardShipment.updateMany({
        where: { shipmentId },
        data: { status: "CANCELLED" },
      });

      return { success: !!response.cancelled };
    } catch (error) {
      console.error("Failed to cancel shipment:", error);
      throw error;
    }
  }

  /**
   * Update shipment status from Leopard (called from webhook)
   */
  static async updateShipmentStatus(
    trackingNumber: string,
    status: string,
    location?: string,
    message?: string
  ): Promise<void> {
    try {
      const shipment = await db.leopardShipment.findUnique({
        where: { trackingNumber },
      });

      if (!shipment) {
        console.warn(`Shipment not found: ${trackingNumber}`);
        return;
      }

      // Map Leopard status to our status enum
      const mappedStatus = this.mapLeopardStatus(status);

      // Update shipment
      await db.leopardShipment.update({
        where: { trackingNumber },
        data: {
          status: mappedStatus,
          lastStatusUpdate: new Date(),
        },
      });

      // Create delivery tracking entry
      await db.deliveryTracking.create({
        data: {
          orderId: shipment.orderId,
          status: mappedStatus as any,
          message: message || status,
          location: location,
          source: "LEOPARD",
        },
      });

      console.log(`📍 Shipment updated: ${trackingNumber} → ${status}`);
    } catch (error) {
      console.error("Failed to update shipment status:", error);
      throw error;
    }
  }

  /**
   * Retry a failed shipment
   */
  static async retryShipment(shipmentId: string): Promise<any> {
    try {
      const shipment = await db.leopardShipment.findUnique({
        where: { shipmentId },
        include: { order: true },
      });

      if (!shipment) {
        throw new Error("Shipment not found");
      }

      if (shipment.retryCount >= 3) {
        throw new Error("Maximum retry attempts exceeded");
      }

      const config = await this.getConfig();
      const response = await this.makeRequest(
        "POST",
        `/shipments/${shipmentId}/retry`,
        {},
        config
      );

      // Update shipment
      const updated = await db.leopardShipment.update({
        where: { shipmentId },
        data: {
          status: "CREATED",
          retryCount: shipment.retryCount + 1,
          errorMessage: null,
          lastStatusUpdate: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error("Failed to retry shipment:", error);
      throw error;
    }
  }

  /**
   * Make authenticated HTTP request to Leopard API
   */
  private static async makeRequest(
    method: string,
    endpoint: string,
    body?: any,
    config?: any
  ): Promise<any> {
    try {
      if (!config) {
        config = await this.getConfig();
      }

      const url = `${this.apiBaseUrl}${endpoint}`;
      const headers: any = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "X-API-Secret": config.apiSecret,
      };

      const options: any = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const error: LeopardApiError = new Error(
          `Leopard API error: ${response.statusText}`
        );
        error.statusCode = response.status;
        error.response = await response.json().catch(() => null);
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * Map Leopard status to our ShipmentStatus enum
   */
  private static mapLeopardStatus(leopardStatus: string): string {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      created: "CREATED",
      in_transit: "IN_TRANSIT",
      out_for_delivery: "OUT_FOR_DELIVERY",
      delivered: "DELIVERED",
      failed: "FAILED",
      cancelled: "CANCELLED",
      returned: "RETURNED",
    };

    return statusMap[leopardStatus?.toLowerCase()] || "PENDING";
  }
}
