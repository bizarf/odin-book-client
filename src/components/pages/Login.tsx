import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import ErrorsType from "../../types/errorsType";
import JwtDecodeType from "../../types/jwtDecode";
import LoadingSpinner from "../LoadingSpinner";
import splashPhoto from "../../assets/pexels-ivan-samkov-4240497.jpg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = {
    getUserInfo: () => void;
};

const Login = ({ getUserInfo }: Props) => {
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    // universal cookie initialisation
    const cookies = new Cookies();
    const navigate = useNavigate();

    const loginFormSchema = z.object({
        username: z
            .string()
            .email({ message: "Username must be a valid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
    });

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkCookie = async () => {
            // set this const variable if the cookies contains a variable called jwt_auth
            const jwt = await cookies.get("jwt_auth");
            if (jwt) {
                getUserInfo();
                navigate("/main");
            }
        };
        checkCookie();
    }, []);

    const sendLogin = async (values: z.infer<typeof loginFormSchema>) => {
        setLoading((state) => !state);
        // make an object with the username and password input states

        // start fetch api, with a post method and set the header content type to json
        fetch(`${import.meta.env.VITE_API_HOST}/api/login`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token for the exp time and then create a cookie to store the jwt
                if (data.token) {
                    // decode the jwt
                    const decode: JwtDecodeType = jwtDecode(data.token);
                    cookies.set("jwt_auth", data.token, {
                        // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(decode.exp * 1000),
                    });
                    // this fetches the user's info from the database
                    getUserInfo();
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/main");
                        // refresh. not sure why, but the app isn't re-rendering after the above navigate ever since I rewrote the router
                        navigate(0);
                    }, 500);
                } else if (Array.isArray(data.errors)) {
                    // error messages from express validator go here
                    setError(data.errors);
                } else {
                    // if the error message is an object from passport, then we need to put it in an array
                    setError([data]);
                }
            });
    };

    const handleDemoLogin = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setLoading((state) => !state);

        // start fetch api, with a post method and set the header content type to json
        fetch(`${import.meta.env.VITE_API_HOST}/api/login-demo`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // data object can either return a token or errors. if we get the token object, then we decode the token for the exp time and then create a cookie to store the jwt
                if (data.token) {
                    // decode the jwt
                    const decode: JwtDecodeType = jwtDecode(data.token);
                    cookies.set("jwt_auth", data.token, {
                        // multiply the expiration value from the jwt by 1000 to change the value to milliseconds so that it'll become a valid date
                        expires: new Date(decode.exp * 1000),
                    });
                    // this fetches the user's info from the database
                    getUserInfo();
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/main");
                        navigate(0);
                    }, 500);
                } else if (Array.isArray(data.errors)) {
                    // error messages from express validator go here
                    setError(data.errors);
                } else {
                    // if the error message is an object from passport, then we need to put it in an array
                    setError([data]);
                }
            });
    };

    return (
        <div className="grid sm:grid-cols-2 grid-cols-[0fr_1fr] bg-inherit">
            <div>
                <img
                    src={splashPhoto}
                    className="w-full h-[calc(100vh-5.1rem)] sm:h-[calc(100vh-5.40rem)] object-cover"
                />
            </div>
            <div className="flex items-center justify-center flex-col mx-4">
                <div>
                    <h1 className="text-xl dark:text-white text-center font-bold -mt-8 mb-4">
                        Welcome to Odin Book
                    </h1>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(sendLogin)}
                            className="space-y-3 rounded-xl border border-slate-500 p-4 dark:bg-gray-800"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username (E-mail)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Username (E-mail)"
                                                {...field}
                                                className="dark:bg-slate-900"
                                                maxLength={255}
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Password"
                                                {...field}
                                                className="dark:bg-slate-900"
                                                maxLength={32}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error.map((error, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {error.msg}
                                    </div>
                                );
                            })}
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 dark:text-white hover:bg-blue-600"
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-2 space-y-3 rounded-xl border border-slate-500 p-4 dark:bg-gray-800 flex flex-col">
                        <Link to="sign-up">
                            <Button className="w-full bg-blue-500 dark:text-white hover:bg-blue-600">
                                Create new account
                            </Button>
                        </Link>
                        <Button className="w-full bg-blue-500 dark:text-white hover:bg-blue-600">
                            <Link
                                to={`${import.meta.env.VITE_API_HOST}/api/github-login/`}
                            >
                                <div className="flex items-center">
                                    <img
                                        src="./github-mark-white.svg"
                                        className="w-6"
                                        alt="GitHub logo"
                                    />
                                    <span className="ml-2">
                                        Continue with GitHub
                                    </span>
                                </div>
                            </Link>
                        </Button>
                        <Button
                            className="w-full bg-blue-500 dark:text-white hover:bg-blue-600"
                            onClick={(e) => handleDemoLogin(e)}
                        >
                            Try the demo account
                        </Button>
                    </div>
                </div>
            </div>
            {loading && (
                // this setup prevents clicking of elements whilst the loading spinner is active
                <LoadingSpinner />
            )}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Login was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
