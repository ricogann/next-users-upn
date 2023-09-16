type AuthButtonProps = {
    message: string;
};

const AuthButton: React.FC<AuthButtonProps> = (props) => {
    return (
        <div className="">
            <button className="border border-black w-full bg-[#322A7D] p-2 rounded-lg text-white font-bold uppercase">
                {props.message}
            </button>
        </div>
    );
};

export { AuthButton };
