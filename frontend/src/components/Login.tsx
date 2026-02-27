import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../services/auth.service";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        setMessage("");
        setLoading(true);

        AuthService.login(data.username, data.password).then(
            (response) => {
                const roles = response.roles || [];
                console.log("Login Success! Response roles:", roles);
                setLoading(false);
                if (roles.includes("ROLE_FARMER")) {
                    navigate("/farmer/dashboard");
                } else if (roles.includes("ROLE_ADMIN")) {
                    navigate("/admin/dashboard");
                } else if (roles.includes("ROLE_CONSUMER")) {
                    navigate("/consumer/home");
                } else if (roles.includes("ROLE_PROVIDER")) {
                    navigate("/provider/dashboard");
                } else {
                    navigate("/profile");
                }
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <input
                type="text"
                placeholder="Username"
                {...register("username")}
                className="auth-input"
            />
            {errors.username && (
                <div className="error-message">{errors.username.message}</div>
            )}

            <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="auth-input"
            />
            {errors.password && (
                <div className="error-message">{errors.password.message}</div>
            )}

            <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? "Loading..." : "Sign In"}
            </button>

            {message && (
                <div className="alert-message">
                    {message}
                </div>
            )}
        </form>
    );
};

export default Login;
