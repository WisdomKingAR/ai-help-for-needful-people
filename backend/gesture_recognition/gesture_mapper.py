class GestureActionMapper:
    def __init__(self):
        self.mappings = {
            'thumbs_up': 'scroll_down',
            'peace_sign': 'scroll_up',
            'pointing': 'click',
            'open_hand': 'pause',
            'fist': 'resume',
            'none': None
        }
        print("GestureActionMapper initialized")

    def get_action(self, gesture_name):
        """Get action for gesture"""
        return self.mappings.get(gesture_name, None)
