export default function Placeholder({ title }) {
    return (
        <div className="flex items-center justify-center min-h-[50vh] bg-gray-50 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-primary">{title} Page</h1>
            <p className="ml-4 text-gray-500 dark:text-gray-400">Coming Soon</p>
        </div>
    );
}
