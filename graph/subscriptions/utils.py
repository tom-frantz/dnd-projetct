def filter_out_stopped(observers):
    return list(filter(lambda observer: observer.is_stopped is False, observers))
