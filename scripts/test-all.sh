#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

printf '==> Frontend source checks\n'
pnpm run check
pnpm run typecheck
pnpm run test:web

printf '==> .NET unit tests\n'
dotnet test tests/QmTui.Tests/QmTui.Tests.csproj --configuration Debug

printf '==> Release publish for browser E2E\n'
dotnet publish QmTui.csproj -c Release -r linux-x64 -p:PublishAot=false --self-contained false

printf '==> Headless Chromium E2E\n'
QMTUI_E2E_EXECUTABLE="${QMTUI_E2E_EXECUTABLE:-$PWD/bin/Release/net10.0/linux-x64/publish/qmtui}" \
  pnpm run test:e2e

printf 'All frontend, unit, and headless E2E tests passed.\n'
