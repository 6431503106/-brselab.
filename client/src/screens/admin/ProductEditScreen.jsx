import React, { useState, useEffect } from 'react';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadFileHandlerMutation } from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice'; // Import categories query
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

export default function ProductEditScreen() {
    const { id: productId } = useParams();
    const { data: product, isLoading: loadingProduct, error } = useGetProductDetailsQuery(productId);
    const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery(); // Fetch categories
    const [updateProduct, { isLoading: loadingUpdate }, refetch] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: uploadLoading }] = useUploadFileHandlerMutation();

    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: '',
        image: '',
        brand: '',
        category: '',
        countInStock: '',
        description: ''
    });

    useEffect(() => {
        if (!loadingProduct && product) {
            setProductData({
                name: product.name || '',
                image: product.image || '',
                brand: product.brand || '',
                category: product.category || '',
                countInStock: product.countInStock || '',
                description: product.description || ''
            });
        }
    }, [loadingProduct, product]);

    const { name, image, brand, category, countInStock, description } = productData;

    const handleInputChange = e => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                image,
                brand,
                category,
                countInStock,
                description
            }).unwrap();
            toast.success("Product Updated");
            navigate("/admin/products", {
                state: {
                    refetchProductId: productId,
                    refetchHome: true,
                    refetch: true
                }
            });
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    };

    const uploadFileHandler = async e => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setProductData({
                ...productData,
                image: res.image
            });
        } catch (error) {
            toast.error(error?.data?.message || error?.error);
        }
    };

    if (loadingProduct || loadingCategories) return <Spinner />;
    if (error) {
        toast.error(error?.data?.message || error?.error);
        return null;
    }

    return (
        <div className='w-1/3 mx-auto'>
            <h2 className="text-2xl font-semibold mb-4">Edit Product.</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block font-medium">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block font-medium">
                        Image:
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept='image/*'
                        onChange={uploadFileHandler}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="brand" className="block font-medium">
                        Brand:
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={brand}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block font-medium">
                        Category:
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    >
                        <option value="">Select Category</option>
                        {categories?.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="countInStock" className="block font-medium">
                        Count In Stock:
                    </label>
                    <input
                        type="number"
                        id="countInStock"
                        name="countInStock"
                        value={countInStock}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block font-medium">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-4"
                        onClick={handleSubmit}
                    >
                        Update Product
                    </button>

                    <Link to="/admin/products" className="bg-gray-800 text-white py-2.5 px-4 rounded-md mb-4">
                        Back
                    </Link>

                    {uploadLoading && <Spinner />}
                </div>
            </form>
        </div>
    );
}