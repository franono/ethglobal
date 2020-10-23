import React, { Component } from "react";
import Particles from "react-particles-js";

class Canvas extends Component {
  state = { width: "0px", height: "0px" };
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions = () => {
    this.setState({
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`
    });
  };
  render() {
    const { width, height } = this.state;
    console.log(width, height);
    return (
      <Particles
        {...this.state}
        params={{
            "particles": {
            "number": {
                "value": 500,
                "density": {
                "enable": true,
                "value_area": 3000
                }
            },
            "color": {
                "value": ["#630000", "#630000"]
            },
            "shape": {
                "type": "polygon",
                "stroke": {
                "width": 0,
                "color": "#000000"
                },
                "polygon": {
                "nb_sides": 4
                }
            },
            "size": {
                "value": 5,
                "random": true,
                "anim": {
                "enable": true,
                "speed": 4,
                "size_min": 1,
                "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#58636d",
                "opacity": 1,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 5,
                "direction": "left",
                "random": true,
                "straight": true,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
                }
            }
            },
            "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                "enable": true,
                "mode": "grab"
                },
                "onclick": {
                "enable": false,
                "mode": "grab"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                "distance": 200,
                "line_linked": {
                    "opacity": 1
                }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
            },
            "retina_detect": true
        }}
        />
      );
    }
  }
  

export default Canvas;