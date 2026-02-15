import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../services/auth.service";

const Register = () => {
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 3 &&
                    val.toString().length <= 20
            )
            .required("This field is required!"),
        email: Yup.string()
            .email("This is not a valid email.")
            .required("This field is required!"),
        password: Yup.string()
            .test(
                "len",
                "The password must be between 6 and 40 characters.",
                (val: any) =>
                    val &&
                    val.toString().length >= 6 &&
                    val.toString().length <= 40
            )
            .required("This field is required!"),
        role: Yup.string().required("Please select a role"),
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
        setSuccessful(false);

        AuthService.register(data.username, data.email, data.password, [data.role]).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {!successful && (
                <>
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
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="auth-input"
                    />
                    {errors.email && (
                        <div className="error-message">{errors.email.message}</div>
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

                    <select {...register("role")} className="auth-input auth-select">
                        <option value="">Select Your Role</option>
                        <option value="farmer">Farmer</option>
                        <option value="provider">Fertilizer Supplier</option>
                        <option value="consumer">Buyer</option>
                    </select>
                    {errors.role && (
                        <div className="error-message">{errors.role.message}</div>
                    )}

                    <button type="submit" className="auth-submit-btn">
                        Sign Up
                    </button>
                </>
            )}

            {message && (
                <div className={successful ? "success-message" : "alert-message"}>
                    {message}
                </div>
            )}
        </form>
    );
};

export default Register;

