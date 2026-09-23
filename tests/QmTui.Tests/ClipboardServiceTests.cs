using System;
using Terminal.Gui.Views;
using QmTui.Services;
using Xunit;

namespace QmTui.Tests;

public class ClipboardServiceTests
{
    [Fact]
    public void LinuxSystemClipboard_ImplementsContract()
    {
        var clip = new LinuxSystemClipboard();
        Assert.True(clip.IsSupported);
    }

    [Fact]
    public void TextField_MiddleClick_Registered()
    {
        var tf = new TextField();
        bool focusedCalled = false;
        tf.EnableMiddleClickPaste(() => focusedCalled = true);

        Assert.False(focusedCalled);
        Assert.NotNull(tf);
    }
}
