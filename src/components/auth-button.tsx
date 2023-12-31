type AuthButtonProps = {
    message: string;
    handleLogin?: () => void;
};

const AuthButton: React.FC<AuthButtonProps> = ({ message, handleLogin }) => {
    return (
        <div className="">
            <button
                className="border border-black w-full bg-[#07393C] p-2 rounded-lg text-white font-bold uppercase"
                onClick={handleLogin}
            >
                {message}
            </button>
        </div>
    );
};

export { AuthButton };
