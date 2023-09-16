import React from "react";
import { useRouter } from "next/router";

interface Props {
    children: JSX.Element | JSX.Element[];
}

const ProtectedPage: React.FC<Props> = ({ children }) => {
    const router = useRouter();

    const token = false;
    //check if token exist
    token ? null : router.push("/auth/login");
    //if not exist, redirect to login page
    //get token from cookies
    return children;
};

export { ProtectedPage };
