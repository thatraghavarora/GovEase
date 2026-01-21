import "./preloader.css";
import logo from "../assets/logo.png";

const Preloader = () => {
    return (
        <div className="preloader-overlay">
            <div className="preloader-box">
                <img src={logo} alt="GovEase Logo" className="preloader-logo" />
                <div className="loader"></div>
                <p>Loading, please wait...</p>
            </div>
        </div>
    );
};

export default Preloader;
