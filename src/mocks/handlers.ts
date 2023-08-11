import { rest } from "msw";

const testUser = {
    firstname: "Test",
    lastname: "",
    username: "",
    password: "",
    provider: "local",
    joinDate: new Date(),
    photo: "",
    friends: [],
    type: "user",
};

export const handlers = [
    rest.post(
        "https://odin-book-api-5r5e.onrender.com/api/login",
        (req, res, ctx) => {
            console.log(req);
            return res(ctx.status(200), ctx.json({ token: "" }));
        }
    ),
];
