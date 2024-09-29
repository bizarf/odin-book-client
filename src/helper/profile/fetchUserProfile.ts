const fetchUserProfile = async (jwt: string, userId: string) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_HOST}/api/profile/${userId}`,
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
};

export default fetchUserProfile;
