package main

import (
	"bytes"
	"fmt"
	"image"
	"image/png"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/orisano/pixelmatch"
	"github.com/vincent-petithory/dataurl"
)

// Renders html and converts it into an [image.Image].
func html2image(html string, width, height int) (image.Image, error) {
	// Convert html to data url
	dataUrl := dataurl.EncodeBytes([]byte(html))

	// Open html using data url in browser
	path, has := launcher.LookPath()
	if !has {
		return nil, fmt.Errorf("could not find browser path")
	}
	u := launcher.New().
		Headless(true).
		Set("disable-dev-shm-usage").
		Set("disable-gpu").
		Bin(path).
		MustLaunch()
	page := rod.New().Trace(true).ControlURL(u).MustConnect().MustPage(dataUrl).MustWaitLoad()
	page.MustSetViewport(width, height, 1, false)

	// Capture screenshot
	screenshot, err := page.Screenshot(false, &proto.PageCaptureScreenshot{})
	if err != nil {
		return nil, err
	}

	return png.Decode(bytes.NewReader(screenshot))
}

// Validates HTML against target.
func validateHtml(html string, target image.Image, threshold float32) (bool, error) {
	targetWidth := target.Bounds().Dx()
	targetHeight := target.Bounds().Dy()
	numberOfPixels := targetWidth * targetHeight

	// Convert HTML to image
	htmlImage, err := html2image(html, targetWidth, targetHeight)
	if err != nil {
		return false, fmt.Errorf("failed to render HTML: %v", err)
	}

	// Match image to target
	numberOfDiffPixels, err := pixelmatch.MatchPixel(htmlImage, target)
	if err != nil {
		return false, fmt.Errorf("failed to compare rendered HTML to target: %v", err)
	}
	diff := (float32(numberOfDiffPixels) / float32(numberOfPixels)) * 100
	matched := diff <= threshold

	return matched, nil
}
