import { Effect, BlendFunction } from 'postprocessing'
import { Uniform } from 'three'

const fragment = `
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
  }
`

export class DistortionEffect extends Effect {
  constructor() {
    super('DistortionEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
    })
  }
}
