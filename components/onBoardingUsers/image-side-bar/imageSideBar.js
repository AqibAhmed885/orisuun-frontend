import Image from "next/image"

const ImageSideBar = ({ imageUrl = '', mobile_text_image_size = " h-[40px] w-[300px]  ", desktop_text_image_size = 'h-[60px] w-[400px]', mobile_text_image_location = ' bottom-10 left-[-1px]', desktop_text_image_location = ' bottom-10 left-[-1px]', text_image_url = 'discount-image.png', main_banner_image_size = 'min-h-[720px] max-h-[1440px] w-[100%] ', main_banner_image_height = 'h-[960px]', mobile_image_url = '' }) => {
    return (
        <>
            <div className="hidden md:hidden lg:block  lg:w-[80%] xl:w-[60%] overflow-hidden relative" style={{
                background: "linear-gradient(135deg, #2647AF 0%, #1BA3A8 45.38%)"
            }}>
                {/* Main container with gradient */}
                <div className=" z-10   pt-[45px] ps-[25px] ">



                    <div className={`${main_banner_image_height}  ps-4 pt-4 overflow-hidden`}
                        style={{
                            boxSizing: 'border-box',
                            backgroundColor: 'rgba(255, 255, 255, 0.22)',
                            borderTopLeftRadius: '15px',
                        }}
                    >
                        <Image
                            src={imageUrl}
                            alt="Smiling woman with laptop"
                            className={main_banner_image_size}
                            style={{
                                maxWidth: 'none',
                                maxHeight: 'none',
                                borderTopLeftRadius: '10px',
                                objectFit: 'cover'
                            }}
                            width={1487}
                            height={1120}
                            priority={true}
                            quality={85}
                            loading="eager"
                        />
                    </div>


                    <div className={`absolute ${desktop_text_image_location}`}>
                            <Image
                                src={`/images/${text_image_url}`}
                                alt="image"
                                className={desktop_text_image_size}
                                width={400}
                                height={60}
                            priority={true}
                            quality={85}
                            loading="eager"
                            />
                    </div>

                </div>
            </div>

            <div className="relative block md:block lg:hidden bg-gradient-to-br from-[#2647AF] to-[#1BA3A8]">
                {/* Main container with gradient */}
                <div className=" z-10   pt-[45px] ps-[25px] relative ">




                    <div className="">
                        <div
                            className="h-[100%] ps-4 pt-4"
                            style={{
                                boxSizing: 'border-box',
                                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                                borderTopLeftRadius: '15px'

                            }}
                        >
                            <Image
                                src={mobile_image_url}
                                alt="Smiling woman with laptop"
                                className="    w-[100%]  "
                                style={{
                                    borderTopLeftRadius: '10px',
                                    objectFit: 'cover',
                                    height: 'auto'
                                }}
                                width={1487}
                                height={1120}
                                priority={true}
                                quality={85}
                                loading="eager"
                            />
                        </div>
                    </div>




                    <div className={`absolute  ${mobile_text_image_location}`}>

                        <div className='relative'>

                            <Image
                                src={`/images/${text_image_url}`}
                                alt="Smiling woman with laptop"
                                className={mobile_text_image_size}
                                width={400}
                                height={60}
                                priority={true}
                                quality={85}
                                loading="eager"
                            />

                        </div>


                    </div>

                </div>
            </div>
        </>
    )
}

export default ImageSideBar