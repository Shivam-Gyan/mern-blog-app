import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { AnimationWrapper } from "../common";
import Loader from "../components/loader.component";
import CreateTokenModal from "../components/create-token-modal.component";
import DeleteTokenModal from "../components/delete-token-modal.component";
import axios from "axios";
import { toast } from "react-hot-toast";

const IntegrationTokenPage = () => {

    const { userAuth: { access_token } } = useContext(UserContext);

    const [tokens, setTokens] = useState([]);
    const [tokenLimit, setTokenLimit] = useState(5);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchTokens = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/user/get-tokens", {
            headers: { "Authorization": `Bearer ${access_token}` }
        })
        .then(({ data }) => {
            setTokens(data.tokens);
            setTokenLimit(data.integration_token_limit);
            setLoading(false);
        })
        .catch(({ response }) => {
            toast.error(response?.data?.message || "Failed to fetch tokens");
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchTokens();
    }, [access_token]);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const maskToken = (token) => {
        if (!token) return "";
        return token.substring(0, 20) + "••••••••" + token.substring(token.length - 10);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric"
        });
    };

    const isExpired = (dateStr) => new Date(dateStr) < new Date();

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <h1 className="max-md:hidden text-dark-grey text-2xl">Integration Token</h1>

                    <div className="py-10">

                        {/* Info + Create button */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-dark-grey text-sm max-w-[500px]">
                                Generate tokens to access the API programmatically. You can create up to <span className="font-medium text-black">{tokenLimit}</span> more token{tokenLimit !== 1 ? "s" : ""}.
                            </p>
                            <button
                                onClick={() => {
                                    if (tokenLimit <= 0) {
                                        return toast.error("Token limit reached");
                                    }
                                    setShowModal(true);
                                }}
                                className="btn-dark flex items-center gap-2 text-sm py-2 px-5 whitespace-nowrap"
                            >
                                <i className="fi fi-rr-plus text-sm mt-0.5"></i>
                                New Token
                            </button>
                        </div>

                        {/* Tokens table */}
                        {tokens.length === 0 ? (
                            <div className="text-center py-20">
                                <i className="fi fi-rr-key text-4xl text-dark-grey opacity-30"></i>
                                <p className="text-dark-grey mt-4">No integration tokens yet</p>
                                <p className="text-dark-grey text-sm mt-1 opacity-60">Create one to get started with the API</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-grey text-left">
                                            <th className="py-3 pr-4 text-dark-grey text-sm font-medium">Name</th>
                                            <th className="py-3 pr-4 text-dark-grey text-sm font-medium">Token</th>
                                            <th className="py-3 pr-4 text-dark-grey text-sm font-medium">Expires</th>
                                            <th className="py-3 pr-4 text-dark-grey text-sm font-medium">Status</th>
                                            <th className="py-3 text-dark-grey text-sm font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokens.map((token) => (
                                            <tr key={token._id} className="border-b px-2 border-grey/50 hover:bg-grey/30 transition-colors">
                                                <td className="py-4 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fi fi-sr-key text-dark-grey"></i>
                                                        <span className="font-medium text-sm">{token.token_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-xs bg-grey/70 px-2 py-1 rounded font-mono max-w-[250px] truncate block">
                                                            {maskToken(token.access_token)}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(token.access_token, token._id)}
                                                            className="hover:bg-grey p-1.5 rounded transition-colors flex-shrink-0"
                                                            title="Copy token"
                                                        >
                                                            <i className={`fi ${copiedId === token._id ? "fi-rr-check text-green" : "fi-rr-copy text-dark-grey"} text-sm`}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <span className="text-sm text-dark-grey">
                                                        {formatDate(token.expiry_date)}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4">
                                                    {isExpired(token.expiry_date) ? (
                                                        <span className="text-xs bg-red/10 text-red px-2 py-1 rounded-full font-medium">Expired</span>
                                                    ) : (
                                                        <span className="text-xs bg-green/10 text-green px-2 py-1 rounded-full font-medium">Active</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: token._id, name: token.token_name })}
                                                        className="hover:bg-red/10 p-2 rounded transition-colors"
                                                        title="Delete token"
                                                    >
                                                        <i className="fi fi-rr-trash text-red text-sm"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Create Token Modal */}
                    {showModal && (
                        <CreateTokenModal
                            access_token={access_token}
                            onClose={() => setShowModal(false)}
                            onCreated={() => fetchTokens()}
                        />
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteTarget && (
                        <DeleteTokenModal
                            access_token={access_token}
                            deleteTarget={deleteTarget}
                            onClose={() => setDeleteTarget(null)}
                            onDeleted={() => { setDeleteTarget(null); fetchTokens(); }}
                        />
                    )}
                </>
            )}
        </AnimationWrapper>
    );
};

export default IntegrationTokenPage;