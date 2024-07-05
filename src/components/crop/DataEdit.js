import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from '@/lib/slices/userSlice';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios'

const DataEdit = ({ product, setProduct, originalProduct, categories, setCategories, subcategories, setSubcategories, group, setGroup, subgroup, setSubgroup, brands, setBrands, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory, selectedGroup, setSelectedGroup, selectedSubgroup, setSelectedSubgroup, selectedBrand, setSelectedBrand, refetch, type }) => {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const [groupOpen, setGroupOpen] = useState(false);
    const [subGroupOpen, setSubGroupOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);
    const [applicabilityOpen, setApplicabilityOpen] = useState(false);
    const [selectedApplicability, setSelectedApplicability] = useState('');
    const [modalImg, setModalImg] = useState('');
    const [type_1, setType_1] = useState(true);
    const [type_2, setType_2] = useState(false);
    const [sizeTags, setSizeTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [newProductSpecification, setNewProductSpecification] = useState({ key: "", value: "" });
    const userState = useAppSelector((state) => state.userReducer.userInfo);
    const router = useRouter();
    const fileInputRef = useRef(null);
    const VarInputRef = useRef(null);
    const userId = userState?._id
    const customFileInputRef = React.useRef(null);

  const handleButtonClick = () => {
    customFileInputRef.current.click();
  };

    const handleVarClick = () => {
        VarInputRef.current.click();
    }

    const handleFileClick = () => {
        fileInputRef.current.click();
    }

    async function handleVarChange(event, product, setProduct, variationName, index) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post(`http://${process.env.NEXT_PUBLIC_DOMAIN}/api/products/variation-image?id=${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const newImageUrl = response.data.fileUrl;
                let newProduct = { ...product };
                newProduct.vars[variationName][index].attrs.imgs = newImageUrl;
                setProduct({ ...newProduct });
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    };

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            try {
                const response = await axios.post(`http://${process.env.NEXT_PUBLIC_DOMAIN}/api/${userState?.role}/product/upload-images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const imageUrls = response.data.fileUrls;
                setProduct({ ...product, attrs: { ...product?.attrs, imgs: [...product?.attrs?.imgs, ...imageUrls] } })
                return imageUrls;
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        }
    }

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            setSizeTags([...sizeTags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveTag = (index) => {
        setSizeTags(sizeTags.filter((_, i) => i !== index));
    };

    async function submitEditedProduct() {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_DOMAIN}/api/${userState?.role}/product/${type}`, {
            method: 'POST',
            body: JSON.stringify({ originalJson: originalProduct, changedJson: product, userId: userState?._id }),
            headers: {
                'content-type': 'application/json'
            }
        });
        router.push(`/${userState?.role}/product-audit`);
    }

    const handleImagesDragEnd = (result) => {
        if (!result.destination) return;
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        const copyTodos = [...product?.attrs?.imgs];
        const [reorderTodo] = copyTodos.splice(startIndex, 1);
        copyTodos.splice(endIndex, 0, reorderTodo);
        setProduct({ ...product, attrs: { ...product?.attrs, imgs: copyTodos } });
    }

    return (
        <div className='bg-slate-50 h-screen'>
            <div className='flex gap-3 justify-evenly'>
                <div className='relative'>
                    <select className="text-xl border shadow font-serif mt-8 p-4" id="categoryDropdown" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); refetch(e.target.value, selectedSubcategory, selectedGroup, undefined, "category") }}>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='relative'>
                    <select className="text-xl border shadow font-serif mt-8 p-4" id="subcategoryDropdown" value={selectedSubcategory} onChange={(e) => { setSelectedSubcategory(e.target.value); refetch(selectedCategory, e.target.value, selectedGroup, undefined, "subcategory") }}>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory._id} value={subcategory._id}>
                                {subcategory.Sub_Category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='relative'>
                    <select className="text-xl border shadow font-serif mt-8 p-4" id="groupDropdown" value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); refetch(selectedCategory, selectedSubcategory, e.target.value, undefined, "group") }}>
                        {group.map((singleGroup) => (
                            <option key={singleGroup._id} value={singleGroup._id}>
                                {singleGroup.Group_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='relative'>
                    <select className="text-xl border shadow font-serif mt-8 p-4" id="subgroupDropdown" value={selectedSubgroup} onChange={(e) => { setSelectedSubgroup(e.target.value); refetch(selectedCategory, selectedSubcategory, selectedGroup, e.target.value, "subgroup") }}>
                        {subgroup.map((singleSubgroup) => (
                            <option key={singleSubgroup._id} value={singleSubgroup._id}>
                                {singleSubgroup.Subgroup_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className=' m-8 p-12 bg-white shadow-lg'>
                <div className='text-3xl text-orange-400 font-serif mb-4'>Product Detail</div>
                <form className='flex justify-between'>
                    <div>
                        <div className='my-5 relative'>
                            <div className='text-xl'>Brand {brands.length > 0 && <>({brands.length})</>}</div>
                            <select id="brandDropdown" value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setProduct({ ...product, brand: { _id: e.target.value } }) }}>
                                {brands.map((singleBrand) => (
                                    <option key={singleBrand._id} value={singleBrand._id}>
                                        {singleBrand.Brand_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='my-5'>
                            <label className='text-xl'>Product Name</label>
                            <input value={product?.product_name} onChange={(e) => setProduct({ ...product, product_name: e.target.value })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div>
                            <label className='text-xl'>Description</label>
                            <textarea value={product?.product_description} onChange={(e) => setProduct({ ...product, product_description: e.target.value })} className='flex justify-center items-center gap-1 mt-2 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' rows={5} />
                        </div>
                    </div>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Product ID</label>
                            <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' value={product?._id} />
                        </div>

                        <div>
                            <label className='text-xl'>Specification</label>
                            <div className='  '>
                                {product?.desc && Object.entries(product?.desc)?.map(
                                    ([item, index]) => (
                                        <div key={item} className="flex justify-center items-center gap-1  h-auto w-full p-2 rounded">
                                            <input value={item} readOnly className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                            <input value={index} onChange={e => setProduct({ ...product, desc: { ...product?.desc, [item]: e.target.value } })} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="flex justify-center items-center gap-1 mt-2 h-auto w-full p-2  rounded">
                                <input value={newProductSpecification?.key} onChange={e => setNewProductSpecification({ ...newProductSpecification, key: e.target.value })} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                <input value={newProductSpecification?.value} onChange={e => setNewProductSpecification({ ...newProductSpecification, value: e.target.value })} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                <div type='button' onClick={e => { setProduct({ ...product, desc: { ...product?.desc, [newProductSpecification?.key]: newProductSpecification?.value } }); setNewProductSpecification({ key: "", value: "" }) }} className="bg-orange-600 text-white py-2 px-4 mt-2 border-none rounded cursor-pointer transition duration-300 ease-in-out hover:bg-orange-500">Add</div>
                            </div>


                        </div>

                    </div>
                </form>
            </div>
            <div className='m-8 p-12 bg-white shadow-lg'>
                <div className='text-3xl text-orange-400 font-serif mb-4'>Filter</div>
                <form className='flex justify-between'>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Size</label>
                            <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div className='my-5'>
                            <label className='text-xl'>colour</label>
                            <div className='block mt-2 h-12 p-2 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' > <div className="w-8 h-8 bg-blue-500 rounded-full"></div></div>
                        </div>

                    </div>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Thickness</label>
                            <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>

                    </div>
                </form>
            </div>
            <div className='m-8 p-12 bg-white shadow-lg'>
                <div className='text-3xl text-orange-400 font-serif mb-4'>Pricing</div>
                <form className='flex justify-between'>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Price</label>
                            <input type='number' value={product?.price} onChange={e => setProduct({ ...product, price: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div className='my-5'>
                            <label className='text-xl'>Discounted Percentage</label>
                            <input type='number' max={100} min={0} value={product?.discounted_percent} onChange={e => setProduct({ ...product, discounted_percent: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                    </div>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Discounted Price</label>
                            <input type='number' value={product?.discounted_price} onChange={e => setProduct({ ...product, discounted_price: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div className='my-5'>
                            <label className='text-xl'>Mode of payment</label><br />
                            <input type='checkbox' value={"online"} defaultChecked={product?.payment_modes.includes("online")} id="online" onChange={e => e.target.checked ? setProduct({ ...product, payment_modes: [...product?.payment_modes, "online"] }) : setProduct({ ...product, payment_modes: product?.payment_modes.filter(x => x !== "online") })} />
                            <label for="online">online</label><br />
                            <input type='checkbox' value={"COD"} defaultChecked={product?.payment_modes.includes("COD")} id="COD" onChange={e => e.target.checked ? setProduct({ ...product, payment_modes: [...product?.payment_modes, "COD"] }) : setProduct({ ...product, payment_modes: product?.payment_modes.filter(x => x !== "COD") })} />
                            <label for="COD">cod</label><br />
                        </div>
                    </div>
                </form>
            </div>
            <div className=' m-8 p-12 bg-white shadow-lg'>
                <div className='text-3xl text-orange-400 font-serif mb-4'>Delivery Calculation</div>
                <form className='flex justify-between'>
                    <div>
                        <div className='my-5 relative'>
                            <label className='text-xl'>Applicability</label>
                            <select id="applicabilityDropdown" value={product?.applicability} onChange={(e) => setProduct({ ...product, applicability: parseInt(e.target.value) })}>
                                <option key={1} value={1}>1</option>
                                <option key={2} value={2}>2</option>
                                <option key={3} value={3}>3</option>
                                <option key={4} value={4}>4</option>
                            </select>
                        </div>
                        <div className='my-5'>
                            <label className='text-xl'>Labor per floor</label>
                            <input type="number" value={product?.laborPerFloor} onChange={e => setProduct({ ...product, laborPerFloor: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div>
                            <div className='my-5'>
                                <label className='text-xl'>Tag</label>
                                <div className='block mt-2 w-[450px] rounded border-solid border-gray-400 border-[0.5px] p-2'>
                                    {sizeTags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className='inline-flex items-center bg-orange-200 text-orange-600 rounded-full px-3 py-1 mr-2 mb-2'
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type='button'
                                                className='ml-2 text-orange-600'
                                                onClick={() => handleRemoveTag(index)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        className='outline-none h-8 w-full'
                                        type='text'
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder='Enter a tag and press Enter'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='my-5'>
                            <label className='text-xl'>Plyunit</label>
                            <input type='number' value={product?.plyUnit} onChange={e => setProduct({ ...product, plyUnit: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                        <div>
                            <label className='text-xl'>Loading/unloading price</label>
                            <input type='number' value={product?.loadingUnloadingPrice} onChange={e => setProduct({ ...product, loadingUnloadingPrice: parseInt(e.target.value) })} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                        </div>
                    </div>
                </form>
            </div>

            {product?.attrs?.imgs && <>
                <div className='shadow-lg mx-8 flex'>
                    <DragDropContext onDragEnd={handleImagesDragEnd}>
                        <Droppable droppableId="categories" direction="horizontal">
                            {(droppableProvider) => (
                                <ul
                                    ref={droppableProvider.innerRef}
                                    {...droppableProvider.droppableProps}
                                    className='flex '
                                >
                                    {product?.attrs?.imgs.map((imageLink, index) => (
                                        <Draggable
                                            index={index}
                                            key={index}
                                            draggableId={`${index}`}
                                        >
                                            {(draggableProvider) => (
                                                <li
                                                    ref={draggableProvider.innerRef}
                                                    {...draggableProvider.draggableProps}
                                                    {...draggableProvider.dragHandleProps}
                                                    className='p-3 border m-3'
                                                >
                                                    <div>
                                                        <Image unoptimized src={imageLink} width={300} height={300} alt={"product image"} />
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvider.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <img src='/AddImage.svg'
                        onClick={handleFileClick}
                        className=' cursor-pointer mr-3'
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                    />
                </div>
            </>}


            <div className='flex justify-between'>
                <div className={`border-[0.5px] border-solid ${type_1 ? 'border-orange-600 text-orange-600 ' : 'border-gray-400 text-gray-400 '} m-8 h-14 text-2xl py-3 rounded px-6 font-serif cursor-pointer`}
                    onClick={() => { setType_1(true); setType_2(false) }}
                >Type 1: {product?.vars && Object.keys(product?.vars)[0]}</div>
                <div className={`border-[0.5px] border-solid ${type_2 ? 'border-orange-600 text-orange-600 ' : 'border-gray-400 text-gray-400 '} m-8 h-14 text-2xl py-3 rounded px-6 font-serif cursor-pointer`}
                    onClick={() => { setType_1(false); setType_2(true) }}
                >Type 2: {product?.vars && Object.keys(product?.vars)[1]}</div>
            </div>
            <div className='flex justify-between'>
                <div className='font-serif mx-8'>Leave blank for undefined values</div>
            </div>
            {product?.vars && <>
                <div> {(type_1 && JSON.stringify(product?.vars) !== JSON.stringify({})) && (<>{product?.vars[Object.keys(product?.vars)[0]].map((variation, index) => {
                    const variationName = Object.keys(product?.vars)[0];
                    return <>
                        <div className=' m-8 p-12 bg-white shadow-lg'>
                            <div className='text-3xl text-orange-400 font-serif mb-4'>{index + 1}. {Object.keys(product?.vars)[0]} - {variation?.attrs[variationName]}</div>
                            <form className='flex justify-between'>
                                <div>
                                    <div className='my-5 relative'>
                                        <label className='text-xl'>Variants</label>
                                        <input value={variation?.attrs[variationName]} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].attrs[variationName];
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            if (product?.vars?.[variationName]?.[index]?.attrs) {
                                                let newProduct = { ...product };
                                                newProduct.vars[variationName][index].attrs[variationName] = e.target.value;
                                                setProduct({ ...newProduct })
                                            }
                                        }} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product Name</label>
                                        <input value={variation?.product_name} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].product_name;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].product_name = e.target.value;
                                            setProduct({ ...newProduct })
                                        }} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div>
                                        <label className='text-xl'>Description</label>
                                        <textarea rows={5} value={variation?.product_description} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].product_description;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].product_description = e.target.value;
                                            setProduct({ ...newProduct })
                                        }} className='flex justify-center items-center gap-1 mt-2 h-24 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Price</label>
                                        <input type='number' value={variation?.price} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].price;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].price = parseInt(e.target.value);
                                            setProduct({ ...newProduct })
                                        }} className='block mt-2 h-8 rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                </div>
                                <div>
                                    {/* <div className='my-5'>
                                        <label className='text-xl'>Product thickness</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product size</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>colour</label>
                                        <div className='block mt-2 h-12 p-2 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' > <div className="w-8 h-8 bg-blue-500 rounded-full"></div></div>
                                    </div> */}
                                    <div className='my-5'>
                                        <label className='text-xl'>Labour per floor</label>
                                        <input value={variation?.laborPerFloor} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].laborPerFloor;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].laborPerFloor = parseInt(e.target.value);
                                            setProduct({ ...newProduct })
                                        }} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product discounted price</label>
                                        <input value={variation?.discounted_price} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].discounted_price;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].discounted_price = parseInt(e.target.value);
                                            setProduct({ ...newProduct })
                                        }} className='block mt-2 h-8 rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product discounted percentage</label>
                                        <input value={variation?.discounted_percent} onChange={e => {
                                            if (e.target.value == "") {
                                                let newProduct = { ...product };
                                                delete newProduct.vars[variationName][index].discounted_percent;
                                                setProduct({ ...newProduct });
                                                return;
                                            }
                                            let newProduct = { ...product };
                                            newProduct.vars[variationName][index].discounted_percent = parseInt(e.target.value);
                                            setProduct({ ...newProduct })
                                        }} className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>

                                    <div>
                                        <label className='text-xl'>Specification</label>
                                        {variation?.desc && Object.entries(variation?.desc)?.map(
                                            ([item, idx]) => (
                                                <div key={item} className="flex justify-center items-center gap-1 h-auto w-full p-2 rounded">
                                                    <input value={item} readOnly className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                                    <input value={idx} onChange={e => {
                                                        if (product?.vars?.[variationName][index]?.desc) {
                                                            let newProduct = { ...product };
                                                            newProduct.vars[variationName][index].desc[item] = e.target.value;
                                                            setProduct({ ...newProduct })
                                                        }
                                                    }} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                                </div>
                                            )
                                        )}
                                        <div className="flex justify-center items-center gap-1 mt-2 h-auto w-full p-2 rounded">
                                            <input value={newProductSpecification?.key} onChange={e => setNewProductSpecification({ ...newProductSpecification, key: e.target.value })} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                            <input value={newProductSpecification?.value} onChange={e => setNewProductSpecification({ ...newProductSpecification, value: e.target.value })} className="block bg-[#EDF6FF] mt-2 h-8 w-full border-solid border-gray-400 border-[0.5px] p-1 rounded" />
                                            <div type='button' onClick={e => {
                                                let newProduct = { ...product };
                                                newProduct.vars[variationName][index].desc = { ...newProduct?.vars[variationName]?.[index]?.desc, [newProductSpecification?.key]: newProductSpecification?.value };
                                                setProduct({ ...newProduct });
                                                setNewProductSpecification({ key: "", value: "" });
                                            }} className="bg-orange-600 text-white py-2 px-4 mt-2 border-none rounded cursor-pointer transition duration-300 ease-in-out hover:bg-orange-500">Add</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <img
                                className='size-36 cursor-pointer'
                                src={product?.vars[variationName][index]?.attrs?.imgs}
                                onClick={handleVarClick}
                                alt="Product Variation"
                            />
                            <button
                                type="button"
                                onClick={handleButtonClick}
                                className="custom-file-upload-button"
                            >
                                Add Items
                            </button>
                            <input
                                type="file"
                                ref={customFileInputRef}
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    console.log(index);
                                    await handleVarChange(e, product, setProduct, variationName, index);
                                }}
                            />
                        </div>
                    </>
                })}</>)}
                    {type_2 && (
                        <div className=' m-8 p-12 bg-white shadow-lg'>
                            <div className='text-3xl text-orange-400 font-serif mb-4'>1. Variation 1 Type 2</div>
                            <form className='flex justify-between'>
                                <div>
                                    <div className='my-5 relative'>
                                        <label className='text-xl'>Variants</label>
                                        <input className='block mt-2 h-8 rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product Name</label>
                                        <input className='block mt-2 h-8  rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div>
                                        <label className='text-xl'>Description</label>
                                        <input className='flex justify-center items-center gap-1 mt-2 h-24 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Price</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                </div>
                                <div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product thickness</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product size</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>colour</label>
                                        <div className='block mt-2 h-12 p-2 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' > <div className="w-8 h-8 bg-blue-500 rounded-full"></div></div>
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Labour per floor</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product discounted price</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div className='my-5'>
                                        <label className='text-xl'>Product discounted percentage</label>
                                        <input className='block mt-2 h-8 w-[450px] rounded border-solid border-gray-400 border-[0.5px]' />
                                    </div>
                                    <div>
                                        <label className='text-xl'>Specification</label>
                                        <div className='flex justify-center items-center gap-1 mt-2 h-24 w-[450px] rounded border-solid border-gray-400 border-[0.5px]'>
                                            <img src='/addProd.png' className='mt-7' />
                                            <div>
                                                <label className='text-orange-600'>Heading</label>
                                                <input className='block bg-blue-100 mt-2 h-6 w-[200px] border-solid border-gray-400 border-[0.5px]' />
                                            </div>
                                            <div>
                                                <label className='text-orange-600'>Specs</label>
                                                <input className='block bg-blue-100 mt-2 h-6 w-[200px] border-solid border-gray-400 border-[0.5px]' />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </>}
            <button onClick={e => {
                let newProduct = { ...product };
                type_1 ? newProduct?.vars[Object.keys(newProduct?.vars)[0]].push({ attrs: { [Object.keys(newProduct?.vars)[0]]: `new variation ${Date.now()}` } }) : newProduct?.vars[Object.keys(newProduct?.vars)[1]].push({ attrs: { [Object.keys(newProduct?.vars)[0]]: `new variation ${Date.now()}` } })
                setProduct({ ...newProduct });
            }} className='bg-orange-600 w-48 h-14 text-2xl py-3 rounded px-2 text-white font-serif cursor-pointer'>+ Add Varations</button>
            <div className='flex justify-end'>
                <div className='bg-amber-950 mx-8 h-14 text-2xl py-3 rounded px-6 text-white font-serif cursor-pointer'>Save As Draft</div>
                <div onClick={async (e) => await submitEditedProduct()} className='bg-orange-600 w-48 mx-8 h-14 text-2xl py-3 rounded px-14 text-white font-serif cursor-pointer'>Submit</div>
            </div>
            <button className='bg-orange-600 w-48 mx-8 h-14 text-2xl py-3 rounded px-2 text-white font-serif cursor-pointer'>+ Add Varations</button>
        </div>
    );
};

export default DataEdit;
