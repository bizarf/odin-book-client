import { MoonLoader } from "react-spinners";

const LoadingSpinner = () => {
    return (
        <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.7]">
            <MoonLoader color="#CCCCCC" size={150} />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
