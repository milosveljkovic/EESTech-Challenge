import math


def get_shoulder_width(ratio, left_shoulder, right_shoulder):
    print(left_shoulder['x'])
    len_squared = (left_shoulder['y'] - right_shoulder['y'])**2 + (left_shoulder['x'] - right_shoulder['x'])**2
    length = math.sqrt(len_squared)
    return length * ratio


def get_hip_width(ratio, left_hip, right_hip):
    len_squared = (left_hip['y'] - right_hip['y'])**2 + (left_hip['x'] - right_hip['x'])**2
    length = math.sqrt(len_squared)
    return length * ratio


# NOT IMPLEMENTED
def process_img(img):
    ratio = 1

    return ratio
