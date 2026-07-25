/**
 * Ripples3
 * Nico Pr
 * https://nicopr.fr/ripples3
 * https://github.com/nicopowa/ripples3
 */

const DEBUG = true;

const handleError = (err) => {
	console.error(err);

	const errorDiv = document.createElement("div");

	errorDiv.classList.add("err");
	errorDiv.innerHTML = "<div>liquify fail</div>" + "<br/>" + err;
	document.body.appendChild(errorDiv);
};

const lazy = (cb, ms = 256) =>
	setTimeout(cb, ms + Math.round(Math.random() * ms));

class NoParams {
	hashParams() {}

	toggle() {}

	updateSunLight() {}

	updateColors() {}

	liquified() {}

	mask() {}

	updateBounds() {}
}

class Liquid {
	/**
	 * @param {Element} wrap
	 */
	constructor(wrap = document.body) {
		this.BASE_SCALE = 2.0;
		this.REF_SIZE = 1024;
		this.MAX_SCALE = 2.0;
		this.MIN_SCALE = 1.0;
		this.STEP = 1000 / 60;
		this.DISP_SCALE = this.MAX_SCALE;
		this.PAUSE_HIDE = true;
		this.PAUSE_BLUR = false;
		this.TARGET_FPS = 50;
		this.FRAME_SIZE = 32;
		this.SCALE_TIME = 1000;
		this.SCALE_STEP = 0.5;
		this.ENABLE_UPSCALE = true;
		this.LOOPS_TO_SCALE = 3;

		this.MAX_TOUCHES = 10;

		this.PERF_CHECK = false;
		this.LOOP_COUNT = 0;
		this.DOWN_FROM = this.MAX_SCALE;
		this.ww = 0;
		this.wh = 0;
		this.sizeBase = 0;
		this.wrap = wrap;

		this.syncSize();

		this.params = {
			img: "https://nicopowa.github.io/ripples3/assets/img.webp",
			waveSpeed: 0.997,
			damping: 0.996,
			propagationSpeed: 10,

			refraction: 0.66,
			waterHue: 0.619,
			waterColor: [0, 0.286, 1],
			tintStrength: 0.1,
			specularStrength: 0.7,
			roughness: 0.16,
			fresnelEffect: 1.2,
			fresnelPower: 2.6,
			specularPower: 39,
			reflectionFresnel: 1,
			reflectionBlur: 0,
			reflectionDistortion: 0.5,

			skyHue: 0.583,
			skyColor: [0, 0.502, 1],
			depthFactor: 1.7,
			atmosphericScatter: 0.2,
			envMapIntensity: 0.7,

			touchRadius: 0.015,
			initialImpact: 0.32,
			trailStrength: 0,
			trailSpread: 0,

			causticStrength: 0.15,
			causticScale: 1.4,
			causticSpeed: 0.02,
			causticBrightness: 0.42,
			causticDetail: 2.5,

			sunDirection: [0.624, 0.332, 0.707],
			sunAngle: 28,
			sunHeight: 55,
			sunIntensity: 1.2,
			sunHue: 0.18,

			lightDirection: [0.659, -0.534, 0.53],
			lightAngle: 175,
			lightHeight: 50,
			lightIntensity: 0.2,
			lightHue: 0.52,

			waveReflectionStrength: 0.6,
			mirrorReflectionStrength: 0.3,
			velocityReflectionFactor: 0.15
		};

		this.amplify = this.hitting = this.sizing = this.img = this.image = this.cvs = this.gl = this.vertexBuffer = this.physicsProgram = this.physics = this.renderProgram = this.renders = this.currentTexture = this.previousTexture = this.backgroundTexture = this.waterTexture1 = this.waterTexture2 = this.currentFramebuffer = this.framebuffer1 = this.framebuffer2 = null;

		this.loop = -1;
		this.hits = false;

		this.vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

		this.scaledPropagation = this.params.propagationSpeed;

		this.currentFPS = 0;
		this.frameTimeHistory = [];
		this.frameTimeSum = 0;
		this.frameTimeIndex = 0;
		this.lastFrameTime = 0;
		this.lastScaleCheck = 0;
		this.notBefore = 0;

		this.isLiquid = false;
		this.isRunning = false;
		this.isVisible = true;
		this.isFocused = true;
		this.isTouched = false;
		this.isAuto = false;
		this.isTest = false;
		this.testLoop = null;
		this.isAudio = false;

		this.isRaining = false;
		this.lastRainDrop = 0;
		this.rainDropDelay = 384;
		this.maxRaindrops = 4;
		this.activeRaindrops = null;

		this.pops = new Map();
		this.deltaTime = 1;
		this.accumulatedTime = 0;
		this.fish = [];
		this.infos = null;

		this.dirtyPhysics = true;
		this.dirtyRenders = true;
		this.dirtyTouches = true;

		this.bck = document.createElement("canvas");
		this.btx = this.bck.getContext("2d", {
			alpha: false
		});

		this.cvs = document.createElement("canvas");
		this.cvs.style.opacity = "0";
		wrap.appendChild(this.cvs);
	}

	async load(preset) {
		this.renderText("loading");

		await this.fadeCanvas(0);

		this.stopRender();

		this.resetWater();

		if (preset.img && preset.img != this.img) {
			this.img = preset.img;
			await this.loadBackground();
			this.updateBackgroundTexture();
		}

		this.params = {
			...this.params,
			...preset
		};

		this.syncUniforms();

		this.amplify.updateSunLight();
		this.amplify.updateColors();

		this.startRender();

		await this.fadeCanvas(1);
	}

	flow(amplify = null, params = {}) {
		this.amplify = amplify;

		this.params = {
			...this.params,
			...params
		};

		this.img = this.params.img;

		this.infos = document.querySelector("#fps");

		return [
			this.loadBackground,
			this.initializeWebGL,
			this.initShaders,
			this.initUniforms,
			this.initBuffers,
			this.syncCanvas,
			this.syncViewport,
			this.initTextures,
			this.syncTextures,
			this.syncUniforms,
			this.setupEvents,
			this.startRender
		]
			.map((fn) => fn.bind(this))
			.reduce((prv, cur) => prv.then(() => cur()), Promise.resolve())
			.then(() => {
				return this.fadeCanvas(1).then(() => {
					if (DEBUG) console.log("liquified");

					this.isLiquid = true;
					this.amplify.liquified();
				});
			})
			.catch((err) => {
				throw err;
			});
	}

	async loadBackground() {
		const imgUrl = this.img;

		this.image = await this.loadImage(imgUrl);
	}

	loadImage(imgSrc) {
		return new Promise((imgLoaded) => {
			const i = new Image();

			i.addEventListener("load", () => imgLoaded(i));
			i.addEventListener("error", () => {
				throw new Error("image load error " + imgSrc);
			});
			i.crossOrigin = "anonymous";
			i.src = imgSrc;
		});
	}

	initializeWebGL() {
		const contextOptions = {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			powerPreference: "high-performance",
			preserveDrawingBuffer: false
		};

		this.gl = this.cvs.getContext("webgl2", contextOptions);

		if (!this.gl) throw new Error("webgl2 not supported");

		const ext = this.gl.getExtension("EXT_color_buffer_float");

		if (!ext) throw new Error("ext_color_buffer_float not supported");

		this.gl.getExtension("OES_texture_float_linear");

		const glInitErr = this.gl.getError();

		if (glInitErr !== this.gl.NO_ERROR) {
			throw new Error("webgl init error " + glInitErr);
		}
	}

	async initShaders() {
		const VERTEX_SHADER = `#version 300 es
in vec2 position;
out vec2 texCoord;

void main() {
	texCoord = position * 0.5 + 0.5;
	gl_Position = vec4(position, 0.0, 1.0);
}`;

		const PHYSICS_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

uniform vec2 uResolution;
uniform float uDeltaTime;
uniform float uDisplayScale;
uniform float uSizeBase;
uniform float uWaveSpeed;
uniform float uDamping;
uniform float uPropagationSpeed;

uniform sampler2D uPreviousState;
uniform int uTouchCount;

struct Touch {
	vec2 position;
	float radius;
	float strength;
	float damping;
};

uniform Touch uTouchParams[10];
in vec2 texCoord;
out vec4 fragColor;

float getTouchDistance(vec2 texCoord, vec2 touchPos) {
	vec2 pixelCoord = texCoord * uResolution;
	float whatSize = max(uResolution.x, uResolution.y) / uSizeBase;
	vec2 delta = (pixelCoord - touchPos) / whatSize;
	return length(delta);
}

void main() {
	vec2 pixel = 1.0 / uResolution;
	vec4 state = texture(uPreviousState, texCoord);
	float height = state.r;
	float oldHeight = state.g;
	
	float sum = 0.0;
	
	for(int i = 0; i < 12; i++) {
		// precomputed vectors breaks on some android
		float angle = float(i) * 0.523598775;
		vec2 dir = vec2(cos(angle), sin(angle));
		vec2 sampleCoord = texCoord + dir * pixel * uPropagationSpeed;
		sampleCoord = clamp(sampleCoord, vec2(0.0), vec2(1.0));
		sum += texture(uPreviousState, sampleCoord).r;
	}
	
	sum /= 12.0;
	
	float newHeight = sum * 2.0 - oldHeight;
	newHeight = mix(height, newHeight, uWaveSpeed);
	newHeight *= uDamping;
	
	float whatSize = max(uResolution.x, uResolution.y);
	float totalEffect = 0.0;
	
	for(int i = 0; i < uTouchCount; i++) {
		float dist = getTouchDistance(texCoord, uTouchParams[i].position);
		float touchRadius = uTouchParams[i].radius;
		
		if(dist < touchRadius && touchRadius > 0.0) {
			float strength = smoothstep(touchRadius, 0.0, dist);
			float touchEffect = uTouchParams[i].strength * strength;
			totalEffect += touchEffect;
		}
	}
	
	newHeight += totalEffect;
	
	fragColor = vec4(newHeight, height, 0.0, 1.0);
}`;

		const RENDER_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDisplayScale;
uniform sampler2D uWaterHeight;
uniform sampler2D uBackgroundTexture;
uniform sampler2D uPreviousState;
uniform vec3 uSunDirection;
uniform vec3 uLightDirection;
uniform float uSunIntensity;
uniform float uLightIntensity;
uniform vec3 uSunColor;
uniform vec3 uLightColor;
uniform vec3 uWaterColor;
uniform float uTintStrength;
uniform float uSpecularStrength;
uniform float uRoughness;
uniform float uFresnelEffect;
uniform float uFresnelPower;
uniform float uSpecularPower;
uniform float uReflectionFresnel;
uniform float uReflectionDistortion;
uniform vec3 uSkyColor;
uniform float uDepthFactor;
uniform float uAtmosphericScatter;
uniform float uEnvMapIntensity;
uniform float uCausticStrength;
uniform float uCausticScale;
uniform float uCausticSpeed;
uniform float uCausticBrightness;
uniform float uCausticDetail;
uniform float uWaveReflectionStrength;
uniform float uMirrorReflectionStrength;
uniform float uVelocityReflectionFactor;
uniform float uReflectionBlur;
uniform float uRefraction;

in vec2 texCoord;
out vec4 fragColor;

vec3 getNormal(vec2 uv, vec2 pixel, out float velocity) {
	vec4 data = texture(uWaterHeight, uv);
	float height = data.r;
	float oldHeight = data.g;
	velocity = (height - oldHeight) * uDisplayScale;
	
	vec2 offset = pixel * 2.0;

	// Use stable, centered gradient calculation
	float h_l = texture(uWaterHeight, uv - vec2(offset.x, 0.0)).r;
	float h_r = texture(uWaterHeight, uv + vec2(offset.x, 0.0)).r;
	float h_t = texture(uWaterHeight, uv - vec2(0.0, offset.y)).r;
	float h_b = texture(uWaterHeight, uv + vec2(0.0, offset.y)).r;
	
	// Improved gradient calculation to reduce linear artifacts
	vec2 grad = vec2(h_r - h_l, h_b - h_t) * 0.5;

	// Scale the gradient based on velocity for dynamic normals
	float normalStrength = 1.0 + abs(velocity) * uVelocityReflectionFactor;
	grad *= normalStrength * uDisplayScale;
	
	return normalize(vec3(grad, 1.0));
}

float getCaustics(vec2 uv, vec3 normal, float velocity) {
	if(uCausticStrength <= 0.0) return 0.0;
	
	float scaledTime = uTime * uCausticSpeed;
	
	float scale = uCausticScale;
	vec2 causticsUV = uv * scale + normal.xy * uReflectionDistortion;
	float timeOffset = scaledTime;
	
	vec2 warp = vec2(
		sin(causticsUV.y * 2.0 + timeOffset),
		sin(causticsUV.x * 2.0 + timeOffset)
	) * 0.1;
	
	causticsUV += warp;
	
	float detail = uCausticDetail * 8.0;
	float pattern = sin(causticsUV.x * detail + timeOffset) * sin(causticsUV.y * detail + timeOffset);
	
	return pattern * 0.5 + 0.5;
}

float getReflection(vec3 normal, vec3 lightDir, vec3 viewDir, float velocity) {
	vec3 halfDir = normalize(lightDir + viewDir);
	float NdotH = max(dot(normal, halfDir), 0.0);
	float NdotL = max(dot(normal, lightDir), 0.0);
	
	float alpha = uRoughness * uRoughness;
	float alpha2 = alpha * alpha;
	float NdotH2 = NdotH * NdotH;
	
	float denom = NdotH2 * (alpha2 - 1.0) + 1.0;
	float D = alpha2 / (3.14159265359 * denom * denom);
	
	float mirrorSpec = D * uMirrorReflectionStrength;
	float waveSpec = pow(NdotH, uSpecularPower) * (1.0 + abs(velocity) * 10.0) * uWaveReflectionStrength;
	
	float velocityFactor = smoothstep(0.0, 1.0, abs(velocity) * uVelocityReflectionFactor);
	return mix(mirrorSpec, waveSpec, velocityFactor) * uSpecularStrength * NdotL;
}

vec3 sampleBlurredBackground(vec2 uv, float radius, vec2 pixel) {
	if(radius <= 0.001) return texture(uBackgroundTexture, uv).rgb;
	
	const int samples = 5;
	vec2 offsets[samples] = vec2[](
		vec2(0.0, 0.0),
		vec2(1.0, 0.0), vec2(-1.0, 0.0), 
		vec2(0.0, 1.0), vec2(0.0, -1.0)
	);
	
	float weights[samples] = float[](
		0.5, 0.125, 0.125, 0.125, 0.125
	);
	
	vec3 color = vec3(0.0);
	for(int i = 0; i < samples; i++) {
		vec2 sampleUv = clamp(uv + offsets[i] * radius * pixel, 0.0, 1.0);
		color += texture(uBackgroundTexture, sampleUv).rgb * weights[i];
	}
	
	return color;
}

void main() {
	vec2 pixel = 1.0 / uResolution;
	vec3 viewDir = vec3(0.0, 0.0, 1.0);
	
	float velocity;
	vec3 normal = getNormal(texCoord, pixel, velocity);
	
	vec4 heightData = texture(uWaterHeight, texCoord);
	float height = heightData.r;
	float depth = clamp(height * uDepthFactor, 0.0, 1.0);
	
	float distortionFactor = min(abs(velocity) * 2.0, 1.0);
	vec2 refractOffset = normal.xy * uRefraction;
	vec2 bgCoord = clamp(texCoord + refractOffset, 0.0, 1.0);
	
	float viewAngle = 1.0 - max(dot(normal, viewDir), 0.0);
	
	float blurRadius = uReflectionBlur * (1.0 + distortionFactor);
	vec3 refractColor = sampleBlurredBackground(bgCoord, blurRadius, pixel);
	
	float waterDepth = smoothstep(0.0, 1.0, depth);
	float scatter = clamp(waterDepth * uAtmosphericScatter, 0.0, 1.0);
	
	vec3 deepWaterColor = mix(uWaterColor, uSkyColor * 0.3, scatter);
	vec3 waterColor = mix(refractColor, deepWaterColor, waterDepth * uTintStrength);
	
	float fresnel = pow(viewAngle, max(uFresnelPower, 1.0)) * uFresnelEffect;
	float reflectionStrength = smoothstep(0.0, 1.0, fresnel);
	
	vec3 sunDir = normalize(uSunDirection);
	vec3 lightDir = normalize(uLightDirection);
	
	float sunSpecular = getReflection(normal, sunDir, viewDir, velocity);
	float lightSpecular = getReflection(normal, lightDir, viewDir, velocity);
	
	vec3 subtleSunColor = mix(vec3(1.0), uSunColor, 0.32);
	vec3 subtleLightColor = mix(vec3(1.0), uLightColor, 0.24);
	
	vec3 sunRefl = subtleSunColor * sunSpecular * uSunIntensity * 3.0 * (1.0 + fresnel);
	vec3 secondaryRefl = subtleLightColor * lightSpecular * uLightIntensity * 2.0 * (1.0 + fresnel * 0.5);
	
	float caustic = getCaustics(texCoord, normal, velocity);
	float causticAttenuation = (1.0 - waterDepth) * (1.0 - scatter * 0.7);
	vec3 causticColor = vec3(1.0, 0.97, 0.9) * caustic * uCausticStrength * uCausticBrightness * causticAttenuation;
	
	vec3 envColor = mix(uSkyColor, vec3(1.0), reflectionStrength);
	vec3 reflectionColor = mix(refractColor, envColor, reflectionStrength) * uEnvMapIntensity * uReflectionFresnel;
	
	vec3 finalColor = mix(waterColor, reflectionColor, reflectionStrength);
	finalColor += sunRefl + secondaryRefl + causticColor;
	
	finalColor = mix(finalColor, uSkyColor, scatter * uAtmosphericScatter);
	
	fragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}`;

		this.physicsProgram = this.createProgram(VERTEX_SHADER, PHYSICS_SHADER);

		this.renderProgram = this.createProgram(VERTEX_SHADER, RENDER_SHADER);
	}

	initBuffers() {
		this.vertexBuffer = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
	}

	syncSize() {
		this.ww = this.wrap.offsetWidth;
		this.wh = this.wrap.offsetHeight;

		this.sizeBase = +Math.max(
			0.25,
			Math.min(
				1.0,
				// 0.4 + 0.6 * Math.log10(Math.max(
				Math.log10(Math.max(this.ww, this.wh) / 320)
			)
		);
		// .toFixed(3); // needs fixing ?

		this.deltaTime = this.BASE_SCALE / this.DISP_SCALE;
	}

	syncCanvas() {
		// round ?
		// const cw = Math.round(this.ww * this.DISP_SCALE);
		// const ch = Math.round(this.wh * this.DISP_SCALE);

		const cw = this.ww * this.DISP_SCALE;
		const ch = this.wh * this.DISP_SCALE;

		this.cvs.width = this.bck.width = cw;
		this.cvs.height = this.bck.height = ch;
	}

	fadeCanvas(op) {
		return new Promise((res) => {
			this.cvs.addEventListener("transitionend", () => res(), {
				once: true
			});

			this.cvs.style.opacity = op;
		});
	}

	syncViewport() {
		this.gl.viewport(0, 0, this.w, this.h);
	}

	syncUniforms() {
		// force prev even value
		this.scaledPropagation =
			2 *
			Math.floor(
				(this.params.propagationSpeed * this.DISP_SCALE) / this.BASE_SCALE / 2
			);

		// this.scaledPropagation = 2 * Math.floor(this.params.propagationSpeed / this.DISP_SCALE * (Math.max(this.w, this.h) / this.REF_SIZE) / 2);

		this.uniformize();
	}

	uniformize() {
		this.dirtyPhysics = true;
		this.dirtyRenders = true;
	}

	initTextures() {
		const gl = this.gl;

		this.waterTexture1 = this.createWaterTexture();
		this.waterTexture2 = this.createWaterTexture();

		this.backgroundTexture = this.createBackgroundTexture();

		this.framebuffer1 = this.createFrameBuf(this.waterTexture1);
		this.framebuffer2 = this.createFrameBuf(this.waterTexture2);

		this.currentFramebuffer = this.framebuffer1;

		this.currentTexture = this.waterTexture1;
		this.previousTexture = this.waterTexture2;

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	createWaterTexture() {
		const gl = this.gl;
		const texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA32F,
			this.w,
			this.h,
			0,
			gl.RGBA,
			gl.FLOAT,
			null
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		const waterError = gl.getError();

		if (waterError !== gl.NO_ERROR) {
			throw new Error("create water texture fail");
		}

		return texture;
	}

	createBackgroundTexture() {
		const gl = this.gl;
		const texture = gl.createTexture();

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			this.w,
			this.h,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			null
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		return texture;
	}

	createFrameBuf(texture) {
		const gl = this.gl;
		const framebuffer = gl.createFramebuffer();

		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER,
			gl.COLOR_ATTACHMENT0,
			gl.TEXTURE_2D,
			texture,
			0
		);

		const frameBufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

		if (frameBufferStatus !== gl.FRAMEBUFFER_COMPLETE) {
			throw new Error(`incomplete framebuffer ${frameBufferStatus}`);
		}

		return framebuffer;
	}

	syncTextures() {
		this.updateTextures();
		this.updateBackgroundTexture();
	}

	handleResize() {
		this.fadeCanvas(0).then(() => this.doResize());
	}

	doResize() {
		this.stopPerfCheck();
		this.amplify.mask(true);

		// Promise.resolve().then(() => {

		this.amplify.updateBounds();
		this.syncLiquid();
		this.fadeCanvas(1);
		this.amplify.mask(false);
		this.startPerfCheck(2000);

		// });
	}

	syncLiquid() {
		this.syncSize();
		this.syncCanvas();
		this.syncUniforms();
		this.syncViewport();
		this.syncTextures();
	}

	updateTextures() {
		const gl = this.gl;

		[this.waterTexture1, this.waterTexture2].forEach((texture) => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA32F,
				this.w,
				this.h,
				0,
				gl.RGBA,
				gl.FLOAT,
				null
			);
		});

		[this.framebuffer1, this.framebuffer2].forEach((framebuffer) => {
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

			if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
				throw new Error("incomplete resized framebuffer");
			}
		});

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	initUniforms() {
		const getUniforms = (prgm, prop) =>
			Object.keys(prop).reduce(
				(uniforms, uniform) => ({
					...uniforms,
					[uniform]: this.gl.getUniformLocation(prgm, `u${prop[uniform]}`)
				}),
				{}
			);

		this.physics = {
			...getUniforms(this.physicsProgram, {
				resolution: "Resolution",
				displayScale: "DisplayScale",
				sizeBase: "SizeBase",
				deltaTime: "DeltaTime",
				time: "Time",
				waveSpeed: "WaveSpeed",
				damping: "Damping",
				propagationSpeed: "PropagationSpeed",
				previousState: "PreviousState",
				touchCount: "TouchCount"
			}),
			touches: new Array(10).fill({}).map((_, i) => {
				const uTouch = `TouchParams[${i}].`;

				return getUniforms(this.physicsProgram, {
					position: `${uTouch}position`,
					radius: `${uTouch}radius`,
					damping: `${uTouch}damping`,
					strength: `${uTouch}strength`
				});
			})
		};

		this.renders = getUniforms(this.renderProgram, {
			resolution: "Resolution",
			time: "Time",
			displayScale: "DisplayScale",
			previousState: "PreviousState",
			waterHeight: "WaterHeight",
			backgroundTexture: "BackgroundTexture",
			sunDirection: "SunDirection",
			lightDirection: "LightDirection",
			sunIntensity: "SunIntensity",
			lightIntensity: "LightIntensity",
			sunColor: "SunColor",
			lightColor: "LightColor",
			refraction: "Refraction",
			waterColor: "WaterColor",
			tintStrength: "TintStrength",
			specularStrength: "SpecularStrength",
			roughness: "Roughness",
			fresnelEffect: "FresnelEffect",
			fresnelPower: "FresnelPower",
			specularPower: "SpecularPower",
			skyColor: "SkyColor",
			depthFactor: "DepthFactor",
			atmosphericScatter: "AtmosphericScatter",
			envMapIntensity: "EnvMapIntensity",
			reflectionFresnel: "ReflectionFresnel",
			reflectionBlur: "ReflectionBlur",
			reflectionDistortion: "ReflectionDistortion",
			causticStrength: "CausticStrength",
			causticScale: "CausticScale",
			causticSpeed: "CausticSpeed",
			causticBrightness: "CausticBrightness",
			causticDetail: "CausticDetail",
			waveReflectionStrength: "WaveReflectionStrength",
			mirrorReflectionStrength: "MirrorReflectionStrength",
			velocityReflectionFactor: "VelocityReflectionFactor"
		});
	}

	createProgram(vertexSource, fragmentSource) {
		const gl = this.gl;

		const program = gl.createProgram();

		const createShader = (type, source) => {
			const shader = gl.createShader(type);

			gl.shaderSource(shader, source);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				const shaderInfo = gl.getShaderInfoLog(shader);

				gl.deleteShader(shader);

				throw new Error(`compile shader fail ${shaderInfo}`);
			}

			return shader;
		};

		let vertShader, fragShader;

		try {
			vertShader = createShader(gl.VERTEX_SHADER, vertexSource);
			fragShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);

			gl.attachShader(program, vertShader);
			gl.attachShader(program, fragShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				const programInfo = gl.getProgramInfoLog(program);

				throw new Error(`link program fail ${programInfo}`);
			}
		} catch (programError) {
			throw programError;
		} finally {
			if (vertShader) gl.deleteShader(vertShader);

			if (fragShader) gl.deleteShader(fragShader);
		}

		return program;
	}

	physicsStep() {
		const gl = this.gl;

		gl.useProgram(this.physicsProgram);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.currentFramebuffer);

		if (this.dirtyPhysics) {
			gl.uniform2f(this.physics.resolution, this.w, this.h);

			gl.uniform1f(this.physics.displayScale, this.DISP_SCALE);

			gl.uniform1f(this.physics.sizeBase, this.sizeBase);

			gl.uniform1f(this.physics.waveSpeed, this.params.waveSpeed);

			gl.uniform1f(this.physics.damping, this.params.damping);

			gl.uniform1f(this.physics.propagationSpeed, this.scaledPropagation);

			this.dirtyPhysics = false;
		}

		gl.uniform1f(this.physics.deltaTime, this.deltaTime);
		gl.uniform1f(this.physics.time, this.accumulatedTime);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

		const positionLoc = gl.getAttribLocation(this.physicsProgram, "position");

		gl.enableVertexAttribArray(positionLoc);

		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		if (this.touchesDirty) this.processTouches();

		gl.activeTexture(gl.TEXTURE0);

		gl.bindTexture(gl.TEXTURE_2D, this.previousTexture);

		gl.uniform1i(this.physics.previousState, 0);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	processTouches() {
		const gl = this.gl;

		const touchCount = Math.min(this.pops.size, this.MAX_TOUCHES);

		gl.uniform1i(this.physics.touchCount, touchCount);

		for (const touch of this.pops.values()) {
			if (touch.index < this.MAX_TOUCHES) {
				const touchUniform = this.physics.touches[touch.index];

				gl.uniform2f(touchUniform.position, touch.x, touch.y);
				gl.uniform1f(touchUniform.radius, touch.touchRadius);
				gl.uniform1f(touchUniform.damping, touch.touchDamping);
				gl.uniform1f(touchUniform.strength, touch.initialImpact);
			}
		}

		this.touchesDirty = false;
	}

	renderStep() {
		const gl = this.gl;

		gl.useProgram(this.renderProgram);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		gl.clearColor(0, 0, 0, 1);

		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

		const positionLoc = gl.getAttribLocation(this.renderProgram, "position");

		gl.enableVertexAttribArray(positionLoc);

		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		if (this.dirtyRenders) this.updateRenderUniforms();

		gl.uniform1f(this.renders.time, this.accumulatedTime);

		// batch texture bindings
		gl.activeTexture(gl.TEXTURE0);

		gl.bindTexture(gl.TEXTURE_2D, this.currentTexture);

		gl.uniform1i(this.renders.waterHeight, 0);

		gl.activeTexture(gl.TEXTURE1);

		gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);

		gl.uniform1i(this.renders.backgroundTexture, 1);

		gl.activeTexture(gl.TEXTURE2);

		gl.bindTexture(gl.TEXTURE_2D, this.previousTexture);

		gl.uniform1i(this.renders.previousState, 2);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		const renderError = gl.getError();

		if (renderError !== gl.NO_ERROR) {
			throw new Error("render step error " + renderError);
		}
	}

	updateRenderUniforms() {
		const gl = this.gl;

		gl.uniform2fv(this.renders.resolution, [this.w, this.h]);

		gl.uniform1f(this.renders.displayScale, this.DISP_SCALE);

		Object.keys(this.params).forEach((prop) => {
			const value = this.params[prop];
			const rendr = this.renders[prop];

			if (typeof value === "number") gl.uniform1f(rendr, value);
			else if (value instanceof Array) gl.uniform3fv(rendr, value);
		});

		this.dirtyRenders = false;
	}

	updateBackgroundTexture() {
		if (!this.image?.complete) return;

		this.btx.fillStyle = "#000000";
		this.btx.fillRect(0, 0, this.w, this.h);

		// flip coordinate system
		this.btx.save();

		this.btx.translate(0, this.h);

		this.btx.scale(1, -1);

		const imgW = this.image.naturalWidth;
		const imgH = this.image.naturalHeight;
		const screenAspect = this.w / this.h;
		const imageAspect = imgW / imgH;

		let sx, sy, sw, sh;

		if (screenAspect > imageAspect) {
			sw = imgW;
			sh = Math.round(imgW / screenAspect);
			sx = 0;
			sy = Math.round((imgH - sh) / 2);
		} else {
			sh = imgH;
			sw = Math.round(imgH * screenAspect);
			sy = 0;
			sx = Math.round((imgW - sw) / 2);
		}

		this.btx.drawImage(this.image, sx, sy, sw, sh, 0, 0, this.w, this.h);

		this.fish.forEach((fish) => {
			const { x, y, w, h } = fish.c();

			this.btx.globalAlpha = 0.55;
			this.btx.shadowColor = "#000000";
			this.btx.shadowBlur = 16;

			this.btx.drawImage(fish.i, x, y, w, h);
		});

		this.btx.restore();

		// update texture
		const gl = this.gl;

		gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.bck);
	}

	toggleRender() {
		if (this.isRunning) this.stopRender();
		else this.startRender();
	}

	startRender() {
		if (this.isRunning) return;

		let perfCheck = this.SCALE_TIME;

		if (!this.lastFrameTime) {
			perfCheck *= 2;
		}

		this.isRunning = true;
		this.amplify.toggle("flow");
		this.lastFrameTime = performance.now();
		this.startPerfCheck(perfCheck);
		this.nextFrame();
	}

	stopRender() {
		if (!this.isRunning) return;

		this.isRunning = false;
		cancelAnimationFrame(this.loop);
		this.stopPerfCheck();
		this.amplify.toggle("flow", false);
	}

	nextFrame() {
		this.loop = requestAnimationFrame((hrts) => this.renderLoop(hrts));
	}

	renderLoop(currentTime) {
		this.accumulatedTime += this.deltaTime;
		this.nextFrame();

		this.physicsStep();
		this.swapBuffers();
		this.renderStep();

		this.checkPerfs(currentTime);
	}

	startPerfCheck(chk = this.SCALE_TIME) {
		if (this.PERF_CHECK) return;

		this.PERF_CHECK = true;

		this.frameTimeHistory = new Array(this.FRAME_SIZE).fill(16.67); // ~60fps default
		this.frameTimeSum = this.FRAME_SIZE * 16.67;
		this.frameTimeIndex = 0;

		this.notBefore = this.lastFrameTime + chk;
	}

	stopPerfCheck() {
		if (!this.PERF_CHECK) return;

		this.renderInfo("--");
		this.PERF_CHECK = false;
		this.LOOP_COUNT = 0;
		this.currentFPS = 0;
	}

	checkPerfs(currentTime) {
		const frameTime = currentTime - this.lastFrameTime;

		this.lastFrameTime = currentTime;

		this.frameTimeHistory[this.frameTimeIndex] = frameTime;
		this.frameTimeIndex =
			(this.frameTimeIndex + 1) & (this.frameTimeHistory.length - 1);

		this.frameTimeSum =
			this.frameTimeSum - this.frameTimeHistory[this.frameTimeIndex] + frameTime;
		const avgFrameTime = this.frameTimeSum / this.frameTimeHistory.length;

		const updatedFPS = Math.round(1000 / avgFrameTime);

		if (updatedFPS !== this.currentFPS) {
			this.currentFPS = updatedFPS;
			/*this.renderInfo(("" + updatedFPS).padStart(
				2,
				"0"
			));*/
		}

		if (!this.PERF_CHECK || currentTime < this.notBefore) return;

		if (currentTime - this.lastScaleCheck >= this.SCALE_TIME) {
			this.lastScaleCheck = currentTime;
			this.LOOP_COUNT++;

			if (this.LOOP_COUNT >= this.LOOPS_TO_SCALE) {
				this.LOOP_COUNT = 0;

				if (this.currentFPS < this.TARGET_FPS) {
					this.downScale();
				} else if (
					this.ENABLE_UPSCALE &&
					this.DISP_SCALE < this.DOWN_FROM &&
					this.DISP_SCALE < this.MAX_SCALE
				) {
					this.upScale();
				}
			}
		}
	}

	downScale() {
		if (this.DISP_SCALE === this.MIN_SCALE) return;

		this.DOWN_FROM = this.DISP_SCALE - this.SCALE_STEP;

		this.setDisplayScale(this.DISP_SCALE - this.SCALE_STEP);
	}

	upScale() {
		if (this.DISP_SCALE == this.MAX_SCALE) return;

		this.setDisplayScale(this.DISP_SCALE + this.SCALE_STEP);
	}

	setDisplayScale(scale) {
		if (scale === this.DISP_SCALE) return;

		this.stopPerfCheck();

		this.DISP_SCALE = Math.max(this.MIN_SCALE, Math.min(this.MAX_SCALE, scale));

		this.syncLiquid();
		this.startPerfCheck();
	}

	renderText(str) {
		window.requestAnimationFrame(() => (this.infos.textContent = str));
	}

	renderInfo(fps) {
		this.infos.textContent =
			(DEBUG ? this.ww + "x" + this.wh + "\n" : "") +
			"x" +
			this.DISP_SCALE.toString() +
			" " +
			fps;
	}

	visibleChange() {
		this.isVisible = document.visibilityState === "visible";

		this.activeChange();
	}

	handleBlur() {
		this.focusChange(false);
	}

	handleFocus() {
		this.focusChange(true);
	}

	focusChange(focused) {
		this.isFocused = focused;
		this.activeChange();
	}

	activeChange() {
		if (this.isActive) this.startRender();
		else this.stopRender();
	}

	swapBuffers() {
		[this.currentFramebuffer, this.currentTexture, this.previousTexture] = [
			this.currentFramebuffer === this.framebuffer1
				? this.framebuffer2
				: this.framebuffer1,
			this.currentTexture === this.waterTexture1
				? this.waterTexture2
				: this.waterTexture1,
			this.previousTexture === this.waterTexture1
				? this.waterTexture2
				: this.waterTexture1
		];
	}

	resetWater() {
		const gl = this.gl;
		const flat = new Float32Array(this.w * this.h * 4);

		for (let i = 0; i < flat.length; i += 4) {
			flat[i] = 0.0; // height
			flat[i + 1] = 0.0; // prev height
			flat[i + 2] = 0.0; // velocity
			flat[i + 3] = 1.0; // alpha
		}

		[this.waterTexture1, this.waterTexture2].forEach((texture) => {
			gl.bindTexture(gl.TEXTURE_2D, texture);

			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA32F,
				this.w,
				this.h,
				0,
				gl.RGBA,
				gl.FLOAT,
				flat
			);
		});

		this.currentFramebuffer = this.framebuffer1;
		this.currentTexture = this.waterTexture1;
		this.previousTexture = this.waterTexture2;
	}

	setupEvents() {
		document.addEventListener("visibilitychange", () => this.visibleChange());

		Object.entries({
			blur: this.handleBlur,
			focus: this.handleFocus
			// "resize": this.handleResize
		}).forEach(([evtName, evtCall]) =>
			window.addEventListener(evtName, evtCall.bind(this))
		);

		Object.entries({
			touchstart: this.doNotTouch,
			pointerdown: this.handlePointerStart,
			pointermove: this.handlePointerMove,
			pointerup: this.handlePointerEnd,
			pointerout: this.handlePointerEnd,
			pointercancel: this.handlePointerEnd
		}).forEach(([evtName, evtCall]) =>
			this.cvs.addEventListener(evtName, evtCall.bind(this))
		);

		const obs = new ResizeObserver((entries) => {
			if (this.isLiquid) {
				this.handleResize();
			}
		});

		obs.observe(this.cvs);
	}

	// pointers handling

	genPopId() {
		return Math.random().toString(36).slice(-6);
	}

	getPointerPos(evt) {
		// const cx = evt.clientX - this.wrap.offsetLeft;
		// const cy = evt.clientY - this.wrap.offsetTop;

		const cx = evt.offsetX;
		const cy = evt.offsetY;

		return {
			x: cx * this.DISP_SCALE,
			y: this.h - cy * this.DISP_SCALE,
			rx: cx,
			ry: cy
		};
	}

	pointOptions() {
		return {
			touchRadius: this.params.touchRadius,
			touchDamping: this.params.touchDamping,
			initialImpact: this.params.initialImpact
		};
	}

	doNotTouch(evt) {
		evt.preventDefault();
	}

	updatePointerPosition(pop) {
		this.touchesDirty = true;
	}

	handlePointerStart(evt) {
		const pId = evt.pointerId;

		if (evt.pointerType === "mouse" && this.pops.has(pId)) {
			return;
		}

		if (!this.isTouched) {
			this.isTouched = true;
		}

		this.cvs.setPointerCapture(pId);
		const pos = this.getPointerPos(evt);

		const touch = {
			x: pos.x,
			y: pos.y,
			px: pos.x,
			py: pos.y,
			rx: pos.rx,
			ry: pos.ry,
			index: this.pops.size,
			...this.pointOptions()
		};

		this.pops.set(pId, touch);

		this.updatePointerPosition(touch);
	}

	handlePointerMove(evt) {
		const pId = evt.pointerId;

		if (this.pops.has(pId)) {
			const pop = this.pops.get(pId);
			const pos = this.getPointerPos(evt);

			pop.px = pop.x;
			pop.py = pop.y;
			pop.x = pos.x;
			pop.y = pos.y;
			pop.rx = pos.rx;
			pop.ry = pos.ry;

			this.updatePointerPosition(pop);

			this.hitParams();
		} else if (evt.pointerType === "mouse") {
			this.handlePointerStart(evt);
		}
	}

	handlePointerEnd(evt) {
		const pId = evt.pointerId;

		if (this.pops.has(pId)) {
			const pop = this.pops.get(pId);

			this.cvs.releasePointerCapture(pId);
			this.updatePointerPosition(pop);
			this.pops.delete(pId);
			this.hitParams();
		}
	}

	hitParams() {
		if (this.amplify.pop) {
			const hit = Array.from(this.pops.values()).some((pop) =>
				this.hitPoint(pop.rx, pop.ry, this.amplify.bnd)
			);

			if (hit !== this.hits) {
				this.hits = hit;
				clearTimeout(this.hitting);
				this.hitting = setTimeout(() => this.amplify.mask(this.hits), 100);
			}
		}
	}

	hitPoint(px, py, bnd) {
		return (
			px >= bnd.x && px <= bnd.x + bnd.w && py >= bnd.y && py <= bnd.y + bnd.h
		);
	}

	// getters

	get w() {
		return this.cvs.width;
	}

	get h() {
		return this.cvs.height;
	}

	get isActive() {
		return (
			(this.isVisible || !this.PAUSE_HIDE) && (this.isFocused || !this.PAUSE_BLUR)
		);
	}
}

(() => {
	console.log(atob("aHR0cHM6Ly9uaWNvcHIuZnIvcmlwcGxlczM"));

	window.addEventListener("error", (evt) => {
		handleError(evt.error);

		return false;
	});

	window.addEventListener("unhandledrejection", (evt) => {
		handleError(evt.reason);

		return false;
	});

	try {
		const rippler = document.querySelector("#ripples3");

		const liquify = new Liquid(rippler);
		const amplify = new NoParams(liquify);

		liquify.flow(amplify, amplify.hashParams()).catch((err) => handleError(err));
	} catch (err) {
		handleError(err);
	}
})();
