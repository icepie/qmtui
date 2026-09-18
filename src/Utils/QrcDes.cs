// SPDX-License-Identifier: MIT
//
// QQ 音乐 QRC 歌词所用的 Triple-DES 实现。
// 注意：它与 .NET 的 System.Security.Cryptography.TripleDES 结果不同——
// 子密钥生成里的循环左移按 (28 - shift) 取值，QQ 的 QRC 就是这个变体加密的，
// 用标准实现解不出来（已用真实报文验证）。因此这里保留这套实现。
//
// 移植自 WXRIW/QQMusicDecoder（MIT License, Copyright (c) 2023 WXRIW）
// https://github.com/WXRIW/QQMusicDecoder/blob/master/QQMusicDecoder/DESHelper.cs
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

using System.IO.Compression;
using System.Text;

namespace QmTui.Utils;

internal static class QrcDes
{
    private const uint Encrypt = 1;
    private const uint Decrypt = 0;

    /// <summary>解密 QRC：十六进制密文 -&gt; Triple-DES(ECB) -&gt; zlib -&gt; UTF-8。</summary>
    public static string DecryptQrc(string? hexText)
    {
        if (string.IsNullOrWhiteSpace(hexText)) return "";
        try
        {
            var encrypted = Convert.FromHexString(hexText.Trim());
            if (encrypted.Length == 0 || encrypted.Length % 8 != 0) return "";

            var schedule = new byte[3][][];
            for (int i = 0; i < 3; i++)
            {
                schedule[i] = new byte[16][];
                for (int j = 0; j < 16; j++) schedule[i][j] = new byte[6];
            }
            TripleDesKeySetup(s_qrcKey, schedule, Decrypt);

            var plain = new byte[encrypted.Length];
            var block = new byte[8];
            for (int i = 0; i < encrypted.Length; i += 8)
            {
                TripleDesCrypt(encrypted.AsSpan(i, 8), block, schedule);
                Buffer.BlockCopy(block, 0, plain, i, 8);
            }

            using var input = new MemoryStream(plain);
            using var zlib = new ZLibStream(input, CompressionMode.Decompress);
            using var reader = new StreamReader(zlib, Encoding.UTF8);
            return reader.ReadToEnd();
        }
        catch
        {
            return "";
        }
    }

    private static readonly byte[] s_qrcKey = Encoding.ASCII.GetBytes("!@#)(*$%123ZXC!@!@#)(NHL");

    private static byte BitNumIntr(uint a, int b, int c) =>
        (byte)((((a) >> (31 - b)) & 0x00000001) << c);

    private static uint BitNumIntl(uint a, int b, int c) => ((a << b) & 0x80000000) >> c;

    private static uint SboxBit(byte a) => (uint)((a & 0x20) | ((a & 0x1f) >> 1) | ((a & 0x01) << 4));

    private static readonly byte[] sbox1 = [
        14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
         0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
         4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
        15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13
    ];

    private static readonly byte[] sbox2 = [
        15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
         3, 13,  4,  7, 15,  2,  8, 15, 12,  0,  1, 10,  6,  9, 11,  5,
         0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
        13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9
    ];

    private static readonly byte[] sbox3 = [
        10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
        13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
        13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
         1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12
    ];

    private static readonly byte[] sbox4 = [
         7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
        13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
        10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
         3, 15,  0,  6, 10, 10, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14
    ];

    private static readonly byte[] sbox5 = [
         2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
        14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
         4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
        11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3
    ];

    private static readonly byte[] sbox6 = [
        12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
        10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
         9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
         4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13
    ];

    private static readonly byte[] sbox7 = [
         4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
        13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
         1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
         6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12
    ];

    private static readonly byte[] sbox8 = [
        13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
         1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
         7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
         2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11
    ];

    private static void KeySchedule(byte[] key, byte[][] schedule, uint mode)
    {
        uint i, j, toGen, c, d;
        uint[] keyRndShift = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
        uint[] keyPermC = [
            56, 48, 40, 32, 24, 16, 8, 0, 57, 49, 41, 33, 25, 17, 9, 1,
            58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35
        ];
        uint[] keyPermD = [
            62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5,
            60, 52, 44, 36, 28, 20, 12, 4, 27, 19, 11, 3
        ];
        uint[] keyCompression = [
            13, 16, 10, 23, 0, 4, 2, 27, 14, 5, 20, 9, 22, 18, 11, 3,
            25, 7, 15, 6, 26, 19, 12, 1, 40, 51, 30, 36, 46, 54, 29, 39,
            50, 44, 32, 47, 43, 48, 38, 55, 33, 52, 45, 41, 49, 35, 28, 31
        ];

        for (i = 0, j = 31, c = 0; i < 28; ++i, --j) c |= BitNum(key, (int)keyPermC[i], (int)j);
        for (i = 0, j = 31, d = 0; i < 28; ++i, --j) d |= BitNum(key, (int)keyPermD[i], (int)j);

        for (i = 0; i < 16; ++i)
        {
            c = ((c << (int)keyRndShift[i]) | (c >> (28 - (int)keyRndShift[i]))) & 0xfffffff0;
            d = ((d << (int)keyRndShift[i]) | (d >> (28 - (int)keyRndShift[i]))) & 0xfffffff0;

            toGen = mode == Decrypt ? 15 - i : i;

            for (j = 0; j < 6; ++j) schedule[toGen][j] = 0;

            for (j = 0; j < 24; ++j)
                schedule[toGen][j / 8] |= BitNumIntr(c, (int)keyCompression[j], (int)(7 - j % 8));

            for (; j < 48; ++j)
                schedule[toGen][j / 8] |= BitNumIntr(d, (int)keyCompression[j] - 27, (int)(7 - j % 8));
        }
    }

    private static void Ip(Span<uint> state, ReadOnlySpan<byte> input)
    {
        state[0] = BitNum(input, 57, 31) | BitNum(input, 49, 30) | BitNum(input, 41, 29) | BitNum(input, 33, 28) |
            BitNum(input, 25, 27) | BitNum(input, 17, 26) | BitNum(input, 9, 25) | BitNum(input, 1, 24) |
            BitNum(input, 59, 23) | BitNum(input, 51, 22) | BitNum(input, 43, 21) | BitNum(input, 35, 20) |
            BitNum(input, 27, 19) | BitNum(input, 19, 18) | BitNum(input, 11, 17) | BitNum(input, 3, 16) |
            BitNum(input, 61, 15) | BitNum(input, 53, 14) | BitNum(input, 45, 13) | BitNum(input, 37, 12) |
            BitNum(input, 29, 11) | BitNum(input, 21, 10) | BitNum(input, 13, 9) | BitNum(input, 5, 8) |
            BitNum(input, 63, 7) | BitNum(input, 55, 6) | BitNum(input, 47, 5) | BitNum(input, 39, 4) |
            BitNum(input, 31, 3) | BitNum(input, 23, 2) | BitNum(input, 15, 1) | BitNum(input, 7, 0);

        state[1] = BitNum(input, 56, 31) | BitNum(input, 48, 30) | BitNum(input, 40, 29) | BitNum(input, 32, 28) |
            BitNum(input, 24, 27) | BitNum(input, 16, 26) | BitNum(input, 8, 25) | BitNum(input, 0, 24) |
            BitNum(input, 58, 23) | BitNum(input, 50, 22) | BitNum(input, 42, 21) | BitNum(input, 34, 20) |
            BitNum(input, 26, 19) | BitNum(input, 18, 18) | BitNum(input, 10, 17) | BitNum(input, 2, 16) |
            BitNum(input, 60, 15) | BitNum(input, 52, 14) | BitNum(input, 44, 13) | BitNum(input, 36, 12) |
            BitNum(input, 28, 11) | BitNum(input, 20, 10) | BitNum(input, 12, 9) | BitNum(input, 4, 8) |
            BitNum(input, 62, 7) | BitNum(input, 54, 6) | BitNum(input, 46, 5) | BitNum(input, 38, 4) |
            BitNum(input, 30, 3) | BitNum(input, 22, 2) | BitNum(input, 14, 1) | BitNum(input, 6, 0);
    }

    private static void InvIp(ReadOnlySpan<uint> state, Span<byte> input)
    {
        input[3] = (byte)(BitNumIntr(state[1], 7, 7) | BitNumIntr(state[0], 7, 6) | BitNumIntr(state[1], 15, 5) |
            BitNumIntr(state[0], 15, 4) | BitNumIntr(state[1], 23, 3) | BitNumIntr(state[0], 23, 2) |
            BitNumIntr(state[1], 31, 1) | BitNumIntr(state[0], 31, 0));

        input[2] = (byte)(BitNumIntr(state[1], 6, 7) | BitNumIntr(state[0], 6, 6) | BitNumIntr(state[1], 14, 5) |
            BitNumIntr(state[0], 14, 4) | BitNumIntr(state[1], 22, 3) | BitNumIntr(state[0], 22, 2) |
            BitNumIntr(state[1], 30, 1) | BitNumIntr(state[0], 30, 0));

        input[1] = (byte)(BitNumIntr(state[1], 5, 7) | BitNumIntr(state[0], 5, 6) | BitNumIntr(state[1], 13, 5) |
            BitNumIntr(state[0], 13, 4) | BitNumIntr(state[1], 21, 3) | BitNumIntr(state[0], 21, 2) |
            BitNumIntr(state[1], 29, 1) | BitNumIntr(state[0], 29, 0));

        input[0] = (byte)(BitNumIntr(state[1], 4, 7) | BitNumIntr(state[0], 4, 6) | BitNumIntr(state[1], 12, 5) |
            BitNumIntr(state[0], 12, 4) | BitNumIntr(state[1], 20, 3) | BitNumIntr(state[0], 20, 2) |
            BitNumIntr(state[1], 28, 1) | BitNumIntr(state[0], 28, 0));

        input[7] = (byte)(BitNumIntr(state[1], 3, 7) | BitNumIntr(state[0], 3, 6) | BitNumIntr(state[1], 11, 5) |
            BitNumIntr(state[0], 11, 4) | BitNumIntr(state[1], 19, 3) | BitNumIntr(state[0], 19, 2) |
            BitNumIntr(state[1], 27, 1) | BitNumIntr(state[0], 27, 0));

        input[6] = (byte)(BitNumIntr(state[1], 2, 7) | BitNumIntr(state[0], 2, 6) | BitNumIntr(state[1], 10, 5) |
            BitNumIntr(state[0], 10, 4) | BitNumIntr(state[1], 18, 3) | BitNumIntr(state[0], 18, 2) |
            BitNumIntr(state[1], 26, 1) | BitNumIntr(state[0], 26, 0));

        input[5] = (byte)(BitNumIntr(state[1], 1, 7) | BitNumIntr(state[0], 1, 6) | BitNumIntr(state[1], 9, 5) |
            BitNumIntr(state[0], 9, 4) | BitNumIntr(state[1], 17, 3) | BitNumIntr(state[0], 17, 2) |
            BitNumIntr(state[1], 25, 1) | BitNumIntr(state[0], 25, 0));

        input[4] = (byte)(BitNumIntr(state[1], 0, 7) | BitNumIntr(state[0], 0, 6) | BitNumIntr(state[1], 8, 5) |
            BitNumIntr(state[0], 8, 4) | BitNumIntr(state[1], 16, 3) | BitNumIntr(state[0], 16, 2) |
            BitNumIntr(state[1], 24, 1) | BitNumIntr(state[0], 24, 0));
    }

    private static uint F(uint state, byte[] key)
    {
        Span<byte> lrgState = stackalloc byte[6];

        var t1 = BitNumIntl(state, 31, 0) | ((state & 0xf0000000) >> 1) | BitNumIntl(state, 4, 5) |
            BitNumIntl(state, 3, 6) | ((state & 0x0f000000) >> 3) | BitNumIntl(state, 8, 11) |
            BitNumIntl(state, 7, 12) | ((state & 0x00f00000) >> 5) | BitNumIntl(state, 12, 17) |
            BitNumIntl(state, 11, 18) | ((state & 0x000f0000) >> 7) | BitNumIntl(state, 16, 23);

        var t2 = BitNumIntl(state, 15, 0) | ((state & 0x0000f000) << 15) | BitNumIntl(state, 20, 5) |
            BitNumIntl(state, 19, 6) | ((state & 0x00000f00) << 13) | BitNumIntl(state, 24, 11) |
            BitNumIntl(state, 23, 12) | ((state & 0x000000f0) << 11) | BitNumIntl(state, 28, 17) |
            BitNumIntl(state, 27, 18) | ((state & 0x0000000f) << 9) | BitNumIntl(state, 0, 23);

        lrgState[0] = (byte)((t1 >> 24) & 0x000000ff);
        lrgState[1] = (byte)((t1 >> 16) & 0x000000ff);
        lrgState[2] = (byte)((t1 >> 8) & 0x000000ff);
        lrgState[3] = (byte)((t2 >> 24) & 0x000000ff);
        lrgState[4] = (byte)((t2 >> 16) & 0x000000ff);
        lrgState[5] = (byte)((t2 >> 8) & 0x000000ff);

        lrgState[0] ^= key[0];
        lrgState[1] ^= key[1];
        lrgState[2] ^= key[2];
        lrgState[3] ^= key[3];
        lrgState[4] ^= key[4];
        lrgState[5] ^= key[5];

        state = (uint)((sbox1[SboxBit((byte)(lrgState[0] >> 2))] << 28) |
            (sbox2[SboxBit((byte)(((lrgState[0] & 0x03) << 4) | (lrgState[1] >> 4)))] << 24) |
            (sbox3[SboxBit((byte)(((lrgState[1] & 0x0f) << 2) | (lrgState[2] >> 6)))] << 20) |
            (sbox4[SboxBit((byte)(lrgState[2] & 0x3f))] << 16) |
            (sbox5[SboxBit((byte)(lrgState[3] >> 2))] << 12) |
            (sbox6[SboxBit((byte)(((lrgState[3] & 0x03) << 4) | (lrgState[4] >> 4)))] << 8) |
            (sbox7[SboxBit((byte)(((lrgState[4] & 0x0f) << 2) | (lrgState[5] >> 6)))] << 4) |
            sbox8[SboxBit((byte)(lrgState[5] & 0x3f))]);

        return BitNumIntl(state, 15, 0) | BitNumIntl(state, 6, 1) | BitNumIntl(state, 19, 2) |
            BitNumIntl(state, 20, 3) | BitNumIntl(state, 28, 4) | BitNumIntl(state, 11, 5) |
            BitNumIntl(state, 27, 6) | BitNumIntl(state, 16, 7) | BitNumIntl(state, 0, 8) |
            BitNumIntl(state, 14, 9) | BitNumIntl(state, 22, 10) | BitNumIntl(state, 25, 11) |
            BitNumIntl(state, 4, 12) | BitNumIntl(state, 17, 13) | BitNumIntl(state, 30, 14) |
            BitNumIntl(state, 9, 15) | BitNumIntl(state, 1, 16) | BitNumIntl(state, 7, 17) |
            BitNumIntl(state, 23, 18) | BitNumIntl(state, 13, 19) | BitNumIntl(state, 31, 20) |
            BitNumIntl(state, 26, 21) | BitNumIntl(state, 2, 22) | BitNumIntl(state, 8, 23) |
            BitNumIntl(state, 18, 24) | BitNumIntl(state, 12, 25) | BitNumIntl(state, 29, 26) |
            BitNumIntl(state, 5, 27) | BitNumIntl(state, 21, 28) | BitNumIntl(state, 10, 29) |
            BitNumIntl(state, 3, 30) | BitNumIntl(state, 24, 31);
    }

    private static void Crypt(ReadOnlySpan<byte> input, Span<byte> output, byte[][] key)
    {
        Span<uint> state = stackalloc uint[2];
        Ip(state, input);

        for (uint idx = 0; idx < 15; ++idx)
        {
            var t = state[1];
            state[1] = F(state[1], key[idx]) ^ state[0];
            state[0] = t;
        }

        state[0] = F(state[1], key[15]) ^ state[0];
        InvIp(state, output);
    }

    private static void TripleDesKeySetup(byte[] key, byte[][][] schedule, uint mode)
    {
        if (mode == Encrypt)
        {
            KeySchedule(key[..8], schedule[0], mode);
            KeySchedule(key[8..16], schedule[1], Decrypt);
            KeySchedule(key[16..], schedule[2], mode);
        }
        else
        {
            KeySchedule(key[..8], schedule[2], mode);
            KeySchedule(key[8..16], schedule[1], Encrypt);
            KeySchedule(key[16..], schedule[0], mode);
        }
    }

    private static void TripleDesCrypt(ReadOnlySpan<byte> input, Span<byte> output, byte[][][] key)
    {
        Crypt(input, output, key[0]);
        Crypt(output, output, key[1]);
        Crypt(output, output, key[2]);
    }

    private static uint BitNum(ReadOnlySpan<byte> a, int b, int c) =>
        (uint)((a[b / 32 * 4 + 3 - b % 32 / 8] >> (7 - b % 8)) & 0x01) << c;
}
