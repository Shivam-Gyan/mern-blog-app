import { useState } from "react";
import { AnimationWrapper } from "../common";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreateTokenModal = ({ access_token, onClose, onCreated }) => {

    const [tokenName, setTokenName] = useState("");
    const [expiryDays, setExpiryDays] = useState(7);
    const [creating, setCreating] = useState(false);
    const [generatedToken, setGeneratedToken] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();

        if (!tokenName.trim()) {
            return toast.error("Please enter a token name");
        }

        setCreating(true);
        let loadingToast = toast.loading("Generating token...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/generate-token", {
            token_name: tokenName.trim(),
            expiry_days: expiryDays
        }, {
            headers: { "Authorization": `Bearer ${access_token}` }
        })
        .then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success(data.message);
            setCreating(false);
            setGeneratedToken(data.access_token);
        })
        .catch(({ response }) => {
            toast.dismiss(loadingToast);
            toast.error(response?.data?.message || "Failed to generate token");
            setCreating(false);
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedToken).then(() => {
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleClose = () => {
        if (generatedToken) {
            onCreated(); // refresh token list
        }
        setTokenName("");
        setExpiryDays(7);
        setGeneratedToken(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <AnimationWrapper>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-[450px] p-8 relative">

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 hover:bg-grey p-1.5 rounded-full transition-colors"
                    >
                        <i className="fi fi-rr-cross text-sm text-dark-grey"></i>
                    </button>

                    {/* Success state — show generated token */}
                    {generatedToken ? (
                        <>
                            <div className="w-14 h-14 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fi fi-rr-check text-green text-xl"></i>
                            </div>

                            <h3 className="text-lg font-medium mb-1 text-center">Token Generated!</h3>
                            <p className="text-dark-grey text-sm mb-5 text-center">
                                Copy your token now. You won't be able to see it again.
                            </p>

                            <div className="bg-grey/50 rounded-lg p-3 mb-4">
                                <p className="text-dark-grey text-xs mb-2 font-medium">Your access token</p>
                                <div className="flex items-start gap-2">
                                    <code className="text-xs bg-white border border-grey px-3 py-2 rounded font-mono break-all flex-1 select-all w-72 truncate max-h-14 overflow-y-auto block">
                                        {generatedToken}
                                    </code>
                                    <button
                                        onClick={copyToClipboard}
                                        className="hover:bg-grey p-2 rounded transition-colors flex-shrink-0 border border-grey bg-white"
                                        title="Copy token"
                                    >
                                        <i className={`fi ${copied ? "fi-rr-check text-green" : "fi-rr-copy text-dark-grey"} text-sm`}></i>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-red/5 rounded-lg p-3 mb-6 flex items-start gap-2">
                                <i className="fi fi-rr-info text-red text-sm mt-0.5"></i>
                                <p className="text-red text-xs leading-5 font-medium">
                                    Store this token securely. It will not be shown again after closing this dialog.
                                </p>
                            </div>

                            <button
                                onClick={handleClose}
                                className="btn-dark w-full py-2.5 text-sm"
                            >
                                Done
                            </button>
                        </>
                    ) : (
                        /* Create form state */
                        <>
                            <h3 className="text-lg font-medium mb-1">Create Integration Token</h3>
                            <p className="text-dark-grey text-sm mb-6">This token will allow programmatic access to the API.</p>

                            <form onSubmit={handleCreate}>

                                {/* Token Name */}
                                <div className="mb-5">
                                    <label className="text-dark-grey text-sm font-medium block mb-2">Token Name <span className="text-red">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tokenName}
                                            onChange={(e) => setTokenName(e.target.value)}
                                            placeholder="e.g. Production API, Dev Testing"
                                            className="input-box pl-11"
                                            maxLength={50}
                                        />
                                        <i className="fi fi-rr-text input-icon"></i>
                                    </div>
                                </div>

                                {/* Expiry Days */}
                                <div className="mb-6">
                                    <label className="text-dark-grey text-sm font-medium block mb-2">Token Expiry</label>
                                    <div className="flex gap-3">
                                        {[7, 14, 30].map((days) => (
                                            <button
                                                key={days}
                                                type="button"
                                                onClick={() => setExpiryDays(days)}
                                                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                                                    expiryDays === days
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-dark-grey border-grey hover:border-black/30"
                                                }`}
                                            >
                                                {days} days
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Warning */}
                                <div className="bg-grey/50 rounded-lg p-3 mb-6 flex items-start gap-2">
                                    <i className="fi fi-rr-info text-dark-grey text-sm mt-0.5"></i>
                                    <p className="text-dark-grey text-xs leading-5">
                                        The token will be shown only once after creation. Make sure to copy and store it securely.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="btn-light flex-1 py-2.5 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="btn-dark flex-1 py-2.5 text-sm"
                                    >
                                        {creating ? "Generating..." : "Generate Token"}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </AnimationWrapper>
        </div>
    );
};

export default CreateTokenModal;
