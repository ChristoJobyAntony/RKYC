import React, { useState } from "react";
import { Box, Typography} from "@mui/material";
import "./css/Carousel.css"


export const CarouselItem = (props : {children : JSX.Element, key? : string, style?: React.CSSProperties }) => {

    return(
        <div 
            className="carousel-item" 
            style={props.style}>
                {props.children}
        </div>
    )
}

type CarouselProps = {
    children : JSX.Element[],
    activeIndex:number, 
    style?: React.CSSProperties,
}
export const Carousel = (props : CarouselProps ) => {
    // const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="carousel" style={props.style}>
            <div className="inner"  style={{transform : `translateX(-${props.activeIndex * 100}%)`}} >
                {props.children.map((child) => {
                    return React.cloneElement(child, {style : {width: "100%"}} );
                })}
            </div>
        </div>
    )
}

export default Carousel
