import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import StarRating from "./StarRating";
import Button from "./Button";

export default function ReviewsSection({ productId }) {
    const { addToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`reviews/?product=${productId}`);
                setReviews(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
        };
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.post('reviews/', {
                product: productId,
                rating: newRating,
                comment: newComment
            });
            setReviews([res.data, ...reviews]);
            setNewComment("");
            addToast("Review submitted!", "success");
        } catch (err) {
            console.error(err);
            addToast("Failed to submit review. Please login.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Reviews List */}
            <div className="flex flex-col gap-6 mb-12">
                {reviews.length === 0 ? (
                    <p className="text-center italic text-gray-500">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white capitalize">{review.user}</h4>
                                    <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Write Review Form */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Write a Review</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className={`text-2xl transition-colors ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Comment</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                            rows="4"
                            className="w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="Share your thoughts..."
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className={`self-start bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
