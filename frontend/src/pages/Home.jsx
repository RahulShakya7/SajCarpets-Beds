import Slider from "../components/home/Slider";
import CategoryOptions from "../components/home/CategoryOptions";
import ProductList from "../components/home/ProductList";
import Advertisements from "../components/home/Advertisements";
import SellingPoints from "../components/home/SellingPoints";
import Blogs from "../components/home/Blogs";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
    return (
        <div className="flex flex-col">
            <Slider />
            {/* <CategoryOptions /> */}
            <ProductList />
            <Advertisements />
            <SellingPoints />
            <Blogs />
            <Testimonials />
        </div>
    );
}
