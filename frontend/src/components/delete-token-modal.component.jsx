import { AnimationWrapper } from "../common";
import axios from "axios";
import { toast } from "react-hot-toast";

const DeleteTokenModal = ({ access_token, deleteTarget, onClose, onDeleted }) => {

    const confirmDelete = () => {
        if (!deleteTarget) return;

        let loadingToast = toast.loading("Deleting...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/delete-token", {
            token_id: deleteTarget.id
        }, {
            headers: { "Authorization": `Bearer ${access_token}` }
        })
        .then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success(data.message);
            onDeleted();
        })
        .catch(({ response }) => {
            toast.dismiss(loadingToast);
            toast.error(response?.data?.message || "Failed to delete token");
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <AnimationWrapper>
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-[400px] p-8 text-center">

                    <div className="w-14 h-14 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fi fi-rr-trash text-red text-xl"></i>
                    </div>

                    <h3 className="text-lg font-medium mb-2">Delete Integration Token</h3>

                    <p className="text-dark-grey text-sm mb-2">
                        Are you sure you want to delete <span className="font-medium text-black">"{deleteTarget.name}"</span>?
                    </p>

                    <p className="text-red text-[12px] mb-6 font-medium">
                        <i className="fi fi-rr-info text-xs mr-1"></i>
                        This action cannot be undone. Any application using this token will lose access immediately.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-light flex-1 py-2.5 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 py-2.5 text-sm bg-red text-white rounded-full hover:bg-opacity-80 capitalize font-medium"
                        >
                            Delete Token
                        </button>
                    </div>
                </div>
            </AnimationWrapper>
        </div>
    );
};

export default DeleteTokenModal;
