import React from "react";
import Gallery from "react-imageslides";

export default function ImageView(state) {

    return (
        <div>
            {/* <Gallery
                isOpen ={state.is_open}
                images={[state.url_src]}
                tapClose={false}
                index={0}
                // onClick={() => {

                //     alert("yes")
                //   }
                //   }
            /> */}

            <Gallery
                isOpen={state.location.state.is_open}
                images={[state.location.state.url_src]}
                tapClose={false}
                index={0}
            />
        </div>
    );
}
