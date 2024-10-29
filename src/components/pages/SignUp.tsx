import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorsType from "../../types/errorsType";
import LoadingSpinner from "../LoadingSpinner";
import useUserStore from "../../stores/useUserStore";
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

const SignUp = () => {
    // user state
    const { user } = useUserStore();

    const [firstname, setFirstname] = useState<string>();
    const [lastname, setLastname] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const navigate = useNavigate();

    const signUpFormSchema = z.object({
        firstname: z
            .string()
            .min(2, {
                message: "First name must be at least 2 characters long",
            })
            .regex(/^[a-zA-Z]+$/, {
                message: "First name can only contain letters",
            }),
        lastname: z
            .string()
            .min(2, { message: "Last name must be at least 2 characters long" })
            .regex(/^[a-zA-Z]+$/, {
                message: "Last name can only contain letters",
            }),
        username: z
            .string()
            .email({ message: "Username must be a valid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
    });

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
        setError([]);
        setLoading((state) => !state);

        // if the password and confirm password do not match, then return an error
        if (values.password !== values.confirmPassword) {
            form.resetField("password");
            form.resetField("confirmPassword");
            setError([
                {
                    location: "",
                    path: "",
                    type: "",
                    value: "",
                    msg: "Passwords do not match",
                },
            ]);
            return setTimeout(() => {
                setError([]);
            }, 5000);
        }

        fetch(`${import.meta.env.VITE_API_HOST}/api/sign-up`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            // need to stringify the values object to be able to send it as a JSON payload
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                if (data.message === "Sign up was successful!") {
                    setSuccess((state) => !state);
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                } else {
                    setError(data.errors);
                    return setTimeout(() => {
                        setError([]);
                    }, 5000);
                }
            });
    };

    useEffect(() => {
        if (user) {
            navigate("/main");
        }
    });

    return (
        <div className="mx-4 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-slate-600">
            <h1 className="py-4 text-center text-2xl font-bold text-gray-800  dark:text-white">
                Sign Up
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSignUp)}
                    className="space-y-3 mb-4 rounded-xl border border-slate-500 p-4 dark:bg-gray-800"
                >
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="First Name"
                                        {...field}
                                        className="dark:bg-slate-900"
                                        maxLength={32}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Last Name"
                                        {...field}
                                        className="dark:bg-slate-900"
                                        maxLength={32}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        type="password"
                                        placeholder="Password"
                                        {...field}
                                        className="dark:bg-slate-900"
                                        maxLength={32}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        {...field}
                                        className="dark:bg-slate-900"
                                        maxLength={32}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />
                    {Array.isArray(error) ? (
                        error.map((error, index) => {
                            return (
                                <span
                                    key={index}
                                    className="text-sm text-red-600"
                                >
                                    {error.msg}
                                </span>
                            );
                        })
                    ) : (
                        <div className="text-sm text-red-600">{error}</div>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 dark:text-white hover:bg-blue-600"
                    >
                        Submit
                    </Button>
                </form>
            </Form>
            {loading && <LoadingSpinner />}
            {success && (
                <div className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center bg-black/[.7]">
                    <div className="rounded-xl border border-slate-500 dark:bg-slate-800 p-4 bg-white">
                        <h2 className="text-2xl sm:text-3xl dark:text-white">
                            Sign up was successful!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
