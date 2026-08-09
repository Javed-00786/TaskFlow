def insertion_sort(records, key):
    """Sorts a list of dictionaries in place by the value at record[key] using insertion sort."""
    for i in range(1, len(records)):
        current = records[i]
        j = i - 1
        while j >= 0 and records[j][key] > current[key]:
            records[j + 1] = records[j]
            j -= 1
        records[j + 1] = current

def binary_search(sorted_records, target_value, key):
    """Searches for a record with record[key] == target_value in a sorted list using binary search.
    Returns the index if found, otherwise -1."""
    low = 0
    high = len(sorted_records) - 1
    
    while low <= high:
        mid = (low + high) // 2
        mid_val = sorted_records[mid][key]
        
        if mid_val == target_value:
            return mid
        elif mid_val < target_value:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1

def linear_search(records, target_value, key):
    """Searches for a record with record[key] == target_value in a list using linear search.
    Returns the index of the first match, otherwise -1."""
    for i, record in enumerate(records):
        if record[key] == target_value:
            return i
    return -1

def insertion_sort_count(records, key):
    """Sorts records in place exactly as insertion_sort does, and returns only a single integer — the comparison count."""
    count = 0
    for i in range(1, len(records)):
        current = records[i]
        j = i - 1
        while j >= 0:
            count += 1
            if records[j][key] > current[key]:
                records[j + 1] = records[j]
                j -= 1
            else:
                break
        records[j + 1] = current
    return count

def binary_search_count(sorted_records, target_value, key):
    """Returns a dictionary with exactly two keys: 'index' and 'comparison_count'."""
    count = 0
    low = 0
    high = len(sorted_records) - 1
    index = -1
    
    while low <= high:
        count += 1
        mid = (low + high) // 2
        mid_val = sorted_records[mid][key]
        
        if mid_val == target_value:
            index = mid
            break
        elif mid_val < target_value:
            low = mid + 1
        else:
            high = mid - 1
            
    return {"index": index, "comparison_count": count}

def linear_search_count(records, target_value, key):
    """Returns a dictionary with exactly two keys: 'index' and 'comparison_count'."""
    count = 0
    index = -1
    for i, record in enumerate(records):
        count += 1
        if record[key] == target_value:
            index = i
            break
    return {"index": index, "comparison_count": count}