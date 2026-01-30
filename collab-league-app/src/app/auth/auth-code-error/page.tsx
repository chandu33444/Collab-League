export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
            <p className="mb-4">There was an error verifying your account.</p>
            <a href="/login" className="btn btn-primary">
                Return to Login
            </a>
        </div>
    );
}
