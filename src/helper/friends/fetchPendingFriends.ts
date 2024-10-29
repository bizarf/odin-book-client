const fetchPendingFriends = async (jwt: string) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_HOST}/api/get-pending-friends`,
            {
                method: "get",
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

export default fetchPendingFriends;
