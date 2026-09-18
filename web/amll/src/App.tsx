import { Box, Theme } from "@radix-ui/themes";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { lazy, StrictMode, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styles from "./App.module.css";
import { AppContainer } from "./components/AppContainer/index.tsx";
import { ExtensionInjectPoint } from "./components/ExtensionInjectPoint/index.tsx";
import { QmtuiMusicContext } from "./components/QmtuiMusicContext/index.tsx";
import { LocalMusicContext } from "./components/LocalMusicContext/index.tsx";
import { MigrationDialog } from "./components/MigrationDialog/index.tsx";
import { NowPlayingBar } from "./components/NowPlayingBar/index.tsx";
import { ShotcutContext } from "./components/ShotcutContext/index.tsx";
import { TaskbarLyricBridge } from "./components/TaskbarLyricBridge/index.tsx";
import { ThemeManager } from "./components/ThemeManager/index.tsx";
import { UpdateContext } from "./components/UpdateContext/index.tsx";
import { WSProtocolMusicContext } from "./components/WSProtocolMusicContext/index.tsx";
import { useMigration } from "./hooks/useMigration.ts";
import { enableTaskbarLyricAtom } from "./states/appAtoms.ts";
import "./i18n";
import { isLyricPageOpenedAtom } from "@applemusic-like-lyrics/react-full";
import { StatsComponent } from "./components/StatsComponent/index.tsx";
import { router } from "./router.tsx";
import {
	hasBackgroundAtom,
	isDarkThemeAtom,
	MusicContextMode,
	musicContextModeAtom,
	showStatJSFrameAtom,
} from "./states/appAtoms.ts";
import { useInitializeWindow } from "./utils/useInitializeWindow.ts";

const ExtensionContext = lazy(() => import("./components/ExtensionContext"));
const AMLLWrapper = lazy(() => import("./components/AMLLWrapper"));

function App() {
	const isLyricPageOpened = useAtomValue(isLyricPageOpenedAtom);
	const showStatJSFrame = useAtomValue(showStatJSFrameAtom);
	const enableTaskbarLyric = useAtomValue(enableTaskbarLyricAtom);
	const musicContextMode = useAtomValue(musicContextModeAtom);
	const isDarkTheme = useAtomValue(isDarkThemeAtom);
	const hasBackground = useAtomValue(hasBackgroundAtom);

	const migration = useMigration();

	useInitializeWindow();

	return (
		<>
			{/* 上下文组件均不建议被 StrictMode 包含，以免重复加载扩展程序发生问题  */}
			{showStatJSFrame && <StatsComponent />}
			{/* qmtui 修改：本地音源依赖桌面端文件能力，网页模式下已移除 */}
			{/* qmtui 修改：任务栏歌词是桌面端扩展，网页模式下已移除 */}
			{/* qmtui 修改：ws-protocol 音源需要桌面端 Rust 服务，网页模式下已移除 */}
			<QmtuiMusicContext />

			{/* qmtui 修改：更新检查依赖 Tauri updater，网页模式下已移除 */}
			<ShotcutContext />
			<ThemeManager />
			<Suspense>
				<ExtensionContext />
			</Suspense>
			<ExtensionInjectPoint injectPointName="context" hideErrorCallout />

			<StrictMode>
				<Theme
					appearance={isDarkTheme ? "dark" : "light"}
					panelBackground="solid"
					hasBackground={hasBackground}
					className={styles.radixTheme}
				>
					<MigrationDialog
						state={migration}
						onStart={migration.startMigration}
						onSkip={migration.skipMigration}
						onDeleteOld={migration.deleteOldData}
						onDismiss={migration.dismiss}
					/>
					<Box
						className={classNames(
							styles.body,
							isLyricPageOpened && styles.amllOpened,
						)}
					>
						<AppContainer playbar={<NowPlayingBar />}>
							<RouterProvider router={router} />
						</AppContainer>
						{/* <Box className={styles.container}>
							<RouterProvider router={router} />
						</Box> */}
					</Box>
					<Suspense>
						<AMLLWrapper />
					</Suspense>
					<ToastContainer
						theme="dark"
						position="bottom-right"
						style={{
							marginBottom: "150px",
						}}
					/>
				</Theme>
			</StrictMode>
		</>
	);
}

export default App;
