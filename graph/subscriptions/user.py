from collections import defaultdict

from graph.subscriptions.utils import filter_out_stopped

user_observers = defaultdict(lambda: [])


def user_update_on_subscribe(root, info, user_id):
    def observer_func(observer):
        user_observers[str(user_id)].append(observer)

    return observer_func


def update_user_subscribers(user):
    global user_observers

    filtered = filter_out_stopped(user_observers[str(user.pk)])

    for user_observer in filtered:
        user_observer.on_next(user)

    user_observers[str(user.pk)] = filtered
