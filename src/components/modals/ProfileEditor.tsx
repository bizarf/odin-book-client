import React, { useState } from "react";
import Cookies from "universal-cookie";
import LoadingSpinner from "../LoadingSpinner";
import ErrorsType from "../../types/errorsType";
import { useNavigate } from "react-router-dom";
import { Cross2Icon } from "@radix-ui/react-icons";
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
    setEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
    userFirstname: string | undefined;
    userLastname: string | undefined;
    userUsername: string | undefined;
    userPhoto: string | undefined;
    userId: string | undefined;
};

const formSchema = z.object({
    firstname: z
        .string()
        .min(2, {
            message: "First name must be at least 2 characters long",
        })
        .regex(/^[a-zA-Z'-]+$/, {
            message:
                "First name can only contain letters, apostrophes, and hyphens",
        }),
    lastname: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .regex(/^[a-zA-Z'-]+$/, {
            message:
                "Last name can only contain letters, apostrophes, and hyphens",
        }),
    username: z
        .string()
        .email({ message: "Username must be a valid email address" }),
    photo: z.string(),
});

const ProfileEditor = ({
    setEditProfile,
    userFirstname,
    userLastname,
    userUsername,
    userPhoto,
    userId,
}: Props) => {
    const [error, setError] = useState<[ErrorsType] | []>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const cookies = new Cookies();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: userFirstname,
            lastname: userLastname,
            username: userUsername,
            photo: userPhoto,
        },
    });

    const handleCloseEditor = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setEditProfile((state) => !state);
    };

    const updateProfile = async (values: z.infer<typeof formSchema>) => {
        setLoading((prevState) => !prevState);
        const jwt = cookies.get("jwt_auth");

        fetch(`${import.meta.env.VITE_API_HOST}/api/profile/${userId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            // need to stringify the username and password to be able to send them as JSON objects
            body: JSON.stringify(values),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading((state) => !state);
                // the data object has a success boolean variable. if it's true, then close the post editor and then either send the user back to the main page or refresh the page
                if (data.success === true) {
                    setEditProfile((state) => !state);
                    navigate(0);
                } else {
                    // error messages from express validator go here
                    setError(data.errors);
                }
            });
    };

    return (
        <div
            className="fixed flex top-0 left-0 right-0 bottom-0 items-center justify-center z-50 bg-black/[.7]"
            onClick={() => setEditProfile((state) => !state)}
        >
            <div
                className="rounded-xl border border-slate-500 bg-white dark:bg-slate-800 p-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between pb-2 items-center">
                    <h2 className="text-xl dark:text-white">Edit Profile</h2>
                    <button
                        onClick={(e) => handleCloseEditor(e)}
                        className="rounded-2xl hover:dark:bg-slate-700 p-1 hover:bg-slate-300"
                    >
                        <Cross2Icon className="w-5 h-5" />
                    </button>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(updateProfile)}
                        className="space-y-3"
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
                                            type="email"
                                            maxLength={255}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Photo URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Photo URL"
                                            {...field}
                                            className="dark:bg-slate-900"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error.map((error, index) => {
                            return (
                                <span
                                    key={index}
                                    className="text-sm text-red-600"
                                >
                                    {error.msg}
                                </span>
                            );
                        })}
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
                {loading && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default ProfileEditor;
