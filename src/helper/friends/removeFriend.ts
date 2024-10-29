const removeFriend = async (userId: string, jwt: string) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_HOST}/api/unfriend/${userId}`,
            {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default removeFriend;
