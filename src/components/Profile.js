
import React, { useRef } from 'react'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/slices/userSlice";

const Page = () => {
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    const userState = useAppSelector((state) => state.userReducer.userInfo);
    const userId = userState?._id
    const dispatch = useAppDispatch();

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    }

    const handleBannerClick = () => {
        bannerInputRef.current.click();
    }

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(`http://localhost:3000/api/me/avatar?id=${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                dispatch(setUser(response.data.response));
                console.log('Avatar uploaded successfully:', response.data.response);
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    }

    const handleBannerChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(`http://localhost:3000/api/me/banner?id=${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                dispatch(setUser(response.data.response));
                console.log('Banner uploaded successfully:', response.data.response);
            } catch (error) {
                console.error('Error uploading banner:', error);
            }
        }
    }

    return (
        <div>
            <img
                src={userState?.avatar}
                className='cursor-pointer'
                onClick={handleAvatarClick}
            />
            <img
                src={userState?.banner}
                className='size-96 cursor-pointer'
                onClick={handleBannerClick}
            />

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />
            <input
                type="file"
                ref={bannerInputRef}
                style={{ display: 'none' }}
                onChange={handleBannerChange}
            />
        </div>
    )
}

export default Page
