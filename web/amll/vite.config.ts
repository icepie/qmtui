import { execSync } from "node:child_process";
import { resolve } from "node:path";
import babel from "@rolldown/plugin-babel";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai-babel/plugin-debug-label";
import jotaiReactRefresh from "jotai-babel/plugin-react-refresh";
import { defineConfig, type Plugin } from "vite";
import i18nextLoader from "vite-plugin-i18next-loader";
import svgr from "vite-plugin-svgr";
import wasm from "vite-plugin-wasm";

const host = process.env.TAURI_DEV_HOST;

function getCommitHash() {
	try {
		return execSync("git rev-parse HEAD", { stdio: "pipe" })
			.toString("utf8")
			.trim();
	} catch (err) {
		console.warn("警告：获取 Git Commit Hash 失败", err);
		return "";
	}
}

function getBranchName() {
	try {
		return execSync("git branch --show-current", { stdio: "pipe" })
			.toString("utf8")
			.trim();
	} catch (err) {
		console.warn("警告：获取 Git Branch Name 失败", err);
		return "";
	}
}

const GitMetadataPlugin = (): Plugin => {
	const VIRTUAL_ID = "virtual:git-metadata-plugin";
	const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;
	let gitCommit = "";
	let gitBranch = "";
	return {
		name: "git-metadata-plugin",
		buildStart: {
			async handler() {
				const metadata = {
					commit: "",
					branch: "",
				};
				if (!gitCommit)
					try {
						gitCommit = getCommitHash();
					} catch (err) {
						console.warn("警告：获取 Git Commit Hash 失败", err);
					}
				if (!gitBranch)
					try {
						gitBranch = getBranchName();
					} catch (err) {
						console.warn("警告：获取 Git Branch Name 失败", err);
					}
				this.emitFile({
					fileName: "git-metadata.json",
					name: "git-metadata",
					source: JSON.stringify(metadata),
					type: "asset",
				});
			},
		},
		resolveId: {
			handler(id) {
				if (id === VIRTUAL_ID) {
					return RESOLVED_VIRTUAL_ID;
				}
			},
		},
		load: {
			handler(id) {
				if (id === RESOLVED_VIRTUAL_ID) {
					return `export const commit = ${JSON.stringify(
						gitCommit,
					)};\nexport const branch = ${JSON.stringify(gitBranch)};`;
				}
			},
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({
			plugins: [jotaiDebugLabel, jotaiReactRefresh],
			include: /\.[jt]sx?$/,
		}),
		wasm(),
		svgr({
			svgrOptions: {
				ref: true,
			},
			include: ["./src/**/*.svg?react", "../react-full/src/**/*.svg?react"],
		}),
		GitMetadataPlugin(),
		i18nextLoader({
			paths: ["./locales"],
			namespaceResolution: "basename",
		}),
	],
	resolve: {
		dedupe: ["react", "react-dom", "jotai"],
		// qmtui 修改：浏览器里没有 Tauri 运行时，统一指向 shims/tauri 下的垫片实现。
		alias: {
			"@tauri-apps/api/core": resolve(__dirname, "shims/tauri/core.js"),
			"@tauri-apps/api/event": resolve(__dirname, "shims/tauri/event.js"),
			"@tauri-apps/api/window": resolve(__dirname, "shims/tauri/window.js"),
			"@tauri-apps/api/path": resolve(__dirname, "shims/tauri/path.js"),
			"@tauri-apps/api/app": resolve(__dirname, "shims/tauri/api-app.js"),
			"@tauri-apps/api": resolve(__dirname, "shims/tauri/api-index.js"),
			"@tauri-apps/plugin-os": resolve(__dirname, "shims/tauri/plugin-os.js"),
			"@tauri-apps/plugin-fs": resolve(__dirname, "shims/tauri/plugin-fs.js"),
			"@tauri-apps/plugin-dialog": resolve(__dirname, "shims/tauri/plugin-dialog.js"),
			"@tauri-apps/plugin-opener": resolve(__dirname, "shims/tauri/plugin-opener.js"),
			"@tauri-apps/plugin-shell": resolve(__dirname, "shims/tauri/plugin-shell.js"),
			"@tauri-apps/plugin-updater": resolve(__dirname, "shims/tauri/plugin-updater.js"),
			"@tauri-apps/plugin-global-shortcut": resolve(__dirname, "shims/tauri/plugin-global-shortcut.js"),
			"@tauri-apps/plugin-http": resolve(__dirname, "shims/tauri/plugin-http.js"),
		},
	},
	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		host: host || false,
		strictPort: true,
		warmup: {
			clientFiles: [
				"src/**/*.tsx",
				"src/**/*.ts",
				"src/**/*.css",
				"src/**/*.svg?react",
			],
		},
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
	},
	// 3. to make use of `TAURI_DEBUG` and other env variables
	// https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
	envPrefix: ["VITE_", "TAURI_"],
	base: "/amll/",
	// qmtui 修改：作为 /amll 子路径下的页面发布，产物直接落到仓库的 www/amll。
	// 原先这里有两个 `build` 键，后一个会整体覆盖前一个（chunkSizeWarningLimit 与
	// rolldownOptions.input 被静默丢弃）。浏览器里只有 index.html 一个入口，
	// extension-window / screenshot / taskbar-lyric 是 Tauri 多窗口用的，故不再声明多入口。
	build: {
		outDir: resolve(__dirname, "../../www/amll"),
		emptyOutDir: true,
		chunkSizeWarningLimit: 2000,
		rolldownOptions: { shimMissingExports: true },
	},
});
