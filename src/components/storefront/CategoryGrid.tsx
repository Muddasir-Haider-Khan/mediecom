import Link from "next/link";
// import { categories } from "@/lib/mock-data";

export default function CategoryGrid({ categories = [] }: { categories: any[] }) {
    return (
        <section className="py-12 lg:py-16">
            <div className="container-custom">
                <div className="text-center mb-10">
                    <h2 className="font-display font-bold text-2xl lg:text-3xl text-surface-900">
                        Browse by <span className="gradient-text">Category</span>
                    </h2>
                    <p className="text-surface-500 mt-2 text-sm">
                        Explore our comprehensive range of medical & surgical products
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.id}`}
                            className="group flex flex-col items-center gap-3 p-4 lg:p-6 rounded-2xl bg-white border border-surface-100 hover:border-primary-200 hover:shadow-glow transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                                {cat.icon}
                            </div>
                            <span className="text-xs font-semibold text-surface-700 group-hover:text-primary-700 transition text-center leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
