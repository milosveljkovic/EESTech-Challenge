import math
import cv2
import numpy as np
import imutils

def get_shoulder_width(ratio, left_shoulder, right_shoulder):
    print(left_shoulder['x'])
    len_squared = (left_shoulder['position']['y'] - right_shoulder['position']['y'])**2 + (left_shoulder['position']['x'] - right_shoulder['position']['x'])**2
    length = math.sqrt(len_squared)
    return length * ratio


def get_hip_width(ratio, left_hip, right_hip):
    len_squared = (left_hip['position']['y'] - right_hip['position']['y'])**2 + (left_hip['position']['x'] - right_hip['position']['x'])**2
    length = math.sqrt(len_squared)
    return length * ratio


# NOT IMPLEMENTED
def process_img(img):
    image = cv2.imread(img)
    marker = find_marker(image)
    ratio = 21/marker[1][0]
    return ratio


def find_marker(image):
    # convert the image to grayscale, blur it, and detect edges
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(gray, 35, 125)

    # find the contours in the edged image and keep the largest one;
    # we'll assume that this is our piece of paper in the image
    (cnts, _) = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    c = max(cnts, key = cv2.contourArea)
    # compute the bounding box of the of the paper region and return it
    return cv2.minAreaRect(c)

