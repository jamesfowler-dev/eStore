import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';


const ProductDetailsPage = async (props: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await props.params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    return (
    <>
        <section>
            <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Images Column */}
                <div className="col-span-2">
                    <ProductImages images={product.images} />
                {/* Images Component */}
                </div>
                {/* Details Column */}
                <div className="col-span-2 p-5">
                    <div className="flex flex-col gap-6">
                        <p>
                            {product.brand} {product.category}
                        </p>
                        <h1 className="h3-bold">{product.name}</h1>
                        <p>{product.rating} of {product.numReviews} Reviews</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <ProductPrice value={Number(product.price)}
                            className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                            />
                        </div>
                        <div className="mt-10">
                            <p className="font-semibold">Description</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>
                {/* Action Colum */}
                <div>
                    <Card>
                        <CardContent className='p-4'>
                            <div className="m-2 flex justify-between">
                                <div>Price</div>
                                <div>
                                    <ProductPrice value={Number(product.price)} />
                                </div>
                            </div>
                            <div className="m-2 flex justify-between">
                                <div>Status</div>
                                {product.stock > 0 ? (
                                    <Badge variant='outline'>In Stock</Badge>
                                ) : (
                                    <Badge variant='destructive'>Out of Stock</Badge>
                                )}
                            </div>
                            {product.stock > 0 && (
                                <div className='flex-center'>
                                    <Button className='w-full'>Add to Cart</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </>
    );
};
 
export default ProductDetailsPage;

// Line-by-line for ProductDetailsPage:

// const ProductDetailsPage = async (props: { params: Promise<{ slug:string }>; }) => {
// Declares an async page component named ProductDetailsPage.
// It receives props, and inside props it expects params containing a 
// slug value (the dynamic route segment from [slug]).

// const { slug } = await props.params;
// Waits for params to resolve, then extracts slug from it.
// Example: if the URL is /nike-air-max, slug becomes nike-air-max.

// const product = await getProductBySlug(slug);
// Calls your server action/helper to fetch a product from the database using that slug.

// if (!product) notFound();
// If no product is returned, it triggers Next.js notFound, which renders your 404 page.

// return <>{product.name}</>;
// If product exists, returns JSX that displays only the product name.
// };
// Ends the function.

// export default ProductDetailsPage;
// Exports this component as the default page component for this route, so Next.js 
// uses it for app/(root)/[slug].