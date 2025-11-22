'use client';

const PageHeader = ({
    title,
    description,
    icon = "fa-home",
    children
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {icon && (
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <i className={`fas ${icon} text-blue-600`}></i>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    </div>
                    {description && (
                        <p className="text-sm text-gray-600">{description}</p>
                    )}
                </div>
                {children && (
                    <div className="ml-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
