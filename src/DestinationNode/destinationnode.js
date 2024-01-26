//Matthew Shotton, R&D User Experience,© BBC 2015
import ProcessingNode from "../ProcessingNodes/processingnode";
import fragmentShader from "./destinationnode.frag";
import vertexShader from "./destinationnode.vert";

const TYPE = "DestinationNode";

class DestinationNode extends ProcessingNode {
    /**
     * Initialise an instance of a DestinationNode.
     *
     * There should only be a single instance of a DestinationNode per VideoContext instance. An VideoContext's destination can be accessed like so: videoContext.desitnation.
     *
     * You should not instantiate this directly.
     */
    constructor(gl, renderGraph, aspectRatio) {
        let definition = {
            fragmentShader,
            vertexShader,
            properties: {},
            inputs: ["u_image"]
        };

        super(gl, renderGraph, definition, definition.inputs, false);
        this._displayName = TYPE;
        this._aspectRatio = aspectRatio || 1.5;
        this._zoom = 1.0;
        this._offset = { x: 0, y: 0 };
    }

    _render() {
        let gl = this._gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.clearColor(0, 0, 0, 0.0); // green;
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.inputs.forEach((node) => {
            super._render();
            //map the input textures input the node
            var texture = node._texture;

            for (let mapping of this._shaderInputsTextureUnitMapping) {
                gl.activeTexture(mapping.textureUnit);
                gl.uniform1i(mapping.location, mapping.textureUnitIndex);
                gl.bindTexture(gl.TEXTURE_2D, texture);
            }

            const offset = { x: 0, y: 0 };
            const canvasAspectRatio = gl.canvas.width / gl.canvas.height;
            let width = gl.canvas.width;
            let height = gl.canvas.height;
            if (canvasAspectRatio < this._aspectRatio) {
                width = gl.canvas.width * this._zoom;
                height = width / this._aspectRatio;
            } else {
                height = gl.canvas.height * this._zoom;
                width = height * this._aspectRatio;
            }
            offset.x = (gl.canvas.width - width) / 2;
            offset.y = (gl.canvas.height - height) / 2;
            gl.viewport(offset.x + this._offset.x, offset.y + this._offset.y, width, height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    }
}

export { TYPE as DESTINATIONTYPE };

export default DestinationNode;
