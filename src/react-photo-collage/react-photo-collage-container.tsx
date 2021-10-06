// import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// import Carousel, { Modal, ModalGateway } from "react-images";

// import {
//     ReactPhotoCollageComponent,
// } from './react-photo-collage-component';

// const createPhotoIds = (photos) => {
//     return photos.map((data, i) => {
//         return { ...data, id: i }
//     });
// }
// const createLayoutPhotoMaps = (layout, photos) => {
//     const newPhotos = createPhotoIds(photos);
//     const newMaps = {};
//     layout.reduce((accumulator, currentValue, currentIndex) => {
//         newMaps[currentIndex] = newPhotos.slice(accumulator, accumulator + currentValue);
//         return accumulator + currentValue;
//     }, 0);

//     return newMaps;

// }

// interface ReactPhotoCollageContainerProps {
//     width?: string;
//     height?: Array<string>;
//     layout: Array<number>;
//     photos: Array<{ source: string }>;
//     showNumOfRemainingPhotos?: boolean
// }
// const checkProps = (props: ReactPhotoCollageContainerProps) => {
//     const defaultProps = {
//         width: '800px',
//         height: new Array(props.layout.length),
//         layout: [],
//         photos: [],
//         showNumOfRemainingPhotos: false
//     }
//     const newProps = { ...defaultProps, ...props };
//     if (newProps.height.length < newProps.layout.length) {
//         for (let i = 0; i < newProps.layout.length; i++) {
//             newProps.height[i] = '200px';
//         }
//     }
//     return newProps;
// }
// const ReactPhotoCollageContainer: React.FC<ReactPhotoCollageContainerProps> = (props) => {
//     const currProps = useMemo(() => checkProps(props), [props]);
//     const { width, height, layout, photos, showNumOfRemainingPhotos } = currProps;
//     const layoutNum = layout.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
//     const remainingNum = photos.length - layoutNum;
//     const [allowRender, setAllowRender] = useState<boolean>(false);
//     const [layoutPhotoMaps, setLayoutPhotoMaps] = useState<any>({});
//     const [viewerIsOpen, setViewerIsOpen] = useState<boolean>(false);
//     const [currentImage, setCurrentImage] = useState<number>(0);

//     useEffect(() => {
//         setLayoutPhotoMaps(createLayoutPhotoMaps(layout, photos));
//     }, []);
//     useEffect(() => {
//         Object.keys(layoutPhotoMaps).length ? setAllowRender(true) : setAllowRender(false);
//     }, [layoutPhotoMaps]);

//     const openLightbox = useCallback((id) => {
//         setCurrentImage(parseInt(id));
//         setViewerIsOpen(true);
//     }, []);
//     const closeLightbox = useCallback(() => {
//         setCurrentImage(0);
//         setViewerIsOpen(false);
//     }, []);

//     if (allowRender) {
//         return (
//             <React.Fragment>
//                 <ReactPhotoCollageComponent
//                     width={width}
//                     height={height}
//                     layout={layout}
//                     layoutPhotoMaps={layoutPhotoMaps}
//                     layoutNum={layoutNum}
//                     remainingNum={remainingNum}
//                     showNumOfRemainingPhotos={showNumOfRemainingPhotos}
//                     openLightbox={openLightbox}
//                 />
//                 <ModalGateway>
//                     {
//                         viewerIsOpen ?
//                             (
//                                 <Modal onClose={closeLightbox}>
//                                     <div>
//                                         <Carousel views={photos} currentIndex={currentImage} />
//                                         <div>Helloooooooo</div>
//                                     </div>
//                                 </Modal>
//                             ) : null
//                     }
//                 </ModalGateway>
//             </React.Fragment>
//         );
//     }

//     return null;
// }

// export default ReactPhotoCollageContainer;

import React, {useEffect, useState, useCallback, useMemo} from 'react';

import {
    ReactPhotoCollageComponent,
} from './react-photo-collage-component';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from 'react-responsive-carousel';

import 'react-responsive-modal/styles.css';
import {Modal} from 'react-responsive-modal';

const createPhotoIds = (photos) => {
    return photos.map((data, i) => {
        return {...data, id: i}
    });
}
const createLayoutPhotoMaps = (layout, photos) => {
    const newPhotos = createPhotoIds(photos);
    const newMaps = {};
    layout.reduce((accumulator, currentValue, currentIndex) => {
        newMaps[currentIndex] = newPhotos.slice(accumulator, accumulator + currentValue);
        return accumulator + currentValue;
    }, 0);

    return newMaps;
}

interface ReactPhotoCollageContainerProps {
    width?: string;
    height?: Array<string>;
    layout?: Array<number>;
    photos?: Array<{ source: string }>;
    showNumOfRemainingPhotos?: boolean;
    renderIconNavPrev: () => JSX.Element;
    renderIconNavNext: () => JSX.Element;
    renderIconClose: () => JSX.Element;
}

const checkProps = (props: ReactPhotoCollageContainerProps) => {
    const defaultProps = {
        width: '800px',
        height: new Array(props?.layout?.length),
        layout: [],
        photos: [],
        showNumOfRemainingPhotos: false
    }
    const newProps = {...defaultProps, ...props};
    if (newProps.height.length < newProps.layout.length) {
        for (let i = 0; i < newProps.layout.length; i++) {
            newProps.height[i] = '200px';
        }
    }
    return newProps;
}
const ReactPhotoCollageContainer: React.FC<ReactPhotoCollageContainerProps> = (props) => {
    const currProps = useMemo(() => checkProps(props), [props]);
    const {
        width,
        height,
        layout,
        photos,
        showNumOfRemainingPhotos,
        renderIconNavPrev,
        renderIconNavNext,
        renderIconClose,
    } = currProps;

    const layoutNum = layout.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const remainingNum = photos.length - layoutNum;
    const [allowRender, setAllowRender] = useState<boolean>(false);
    const [layoutPhotoMaps, setLayoutPhotoMaps] = useState<any>({});
    const [viewerIsOpen, setViewerIsOpen] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        setLayoutPhotoMaps(createLayoutPhotoMaps(layout, photos));
    }, [photos]);

    useEffect(() => {
        Object.keys(layoutPhotoMaps).length ? setAllowRender(true) : setAllowRender(false);
    }, [layoutPhotoMaps]);

    const openLightbox = useCallback((id) => {
        setCurrentImageIndex(parseInt(id));
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setTimeout(() => {
            setCurrentImageIndex(0);
        }, 350)
        setViewerIsOpen(false);
    }, []);

    const onChangeImageIndex = useCallback((index: number) => {
        setTimeout(() => {
            setCurrentImageIndex(index)
        }, 350)
    }, [])

    if (allowRender) {
        return (
            <React.Fragment>
                <ReactPhotoCollageComponent
                    width={width}
                    height={height}
                    layout={layout}
                    layoutPhotoMaps={layoutPhotoMaps}
                    layoutNum={layoutNum}
                    remainingNum={remainingNum}
                    showNumOfRemainingPhotos={showNumOfRemainingPhotos}
                    openLightbox={openLightbox}
                />
                <Modal
                    open={viewerIsOpen}
                    onClose={closeLightbox}
                    center
                    classNames={{
                        root: 'custom-modal-root',
                        overlay: 'custom-modal-overlay',
                        modalContainer: 'custom-modal-container',
                        modal: 'custom-modal',
                    }}
                    closeIcon={renderIconClose()}
                >
                    <Carousel
                        className={'photo-collage-carousel-root'}
                        showArrows={true}
                        showThumbs={false}
                        showIndicators={false}
                        showStatus={false}
                        selectedItem={currentImageIndex}
                        renderArrowPrev={(onClick, disabled) => {
                            return <div
                                className={'image-gallery-icon image-gallery-left-nav'}
                                style={{color: 'white'}}
                                onClick={onClick}
                            >
                                {renderIconNavPrev()}
                            </div>
                        }}
                        renderArrowNext={(onClick, disabled) => {
                            return <div
                                className={'image-gallery-icon image-gallery-right-nav'}
                                style={{color: 'white'}}
                                onClick={onClick}
                            >
                                {renderIconNavNext()}
                            </div>
                        }}
                        onChange={onChangeImageIndex}
                    >
                        {photos?.map((photo, index) => {
                            return (
                                <>
                                    <div className={'slide-image-container'}>
                                        <img src={photo.source}/>
                                        <div className={'carousel-status-container'}>
                                            <span className={'carousel-status-text'}>{currentImageIndex + 1}/{photos.length}</span>
                                        </div>
                                    </div>

                                    <p className="legend">{photo.description}</p>
                                </>
                            )
                        })}
                    </Carousel>
                </Modal>
            </React.Fragment>
        );
    }

    return null;
}

export default ReactPhotoCollageContainer;

