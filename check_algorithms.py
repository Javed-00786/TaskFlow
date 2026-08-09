import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.algorithms import insertion_sort, binary_search, linear_search, insertion_sort_count, binary_search_count, linear_search_count

def test_insertion_sort_empty():
    records = []
    insertion_sort(records, key="title")
    expected = []
    result = records
    if result == expected:
        print(f"PASS: insertion_sort on empty list")
    else:
        print(f"FAIL: insertion_sort on empty list — expected {expected}, got {result}")

def test_insertion_sort_single():
    records = [{"title": "Task 1"}]
    insertion_sort(records, key="title")
    expected = [{"title": "Task 1"}]
    result = records
    if result == expected:
        print(f"PASS: insertion_sort on single-element list")
    else:
        print(f"FAIL: insertion_sort on single-element list — expected {expected}, got {result}")

def test_binary_search_found():
    records = [
        {"title": "Task A"},
        {"title": "Task B"},
        {"title": "Task C"},
        {"title": "Task D"},
        {"title": "Task E"}
    ]
    # Test first index
    result = binary_search(records, "Task A", key="title")
    expected = 0
    if result == expected:
        print(f"PASS: binary_search finds value at first index")
    else:
        print(f"FAIL: binary_search finds value at first index — expected {expected}, got {result}")
    
    # Test last index
    result = binary_search(records, "Task E", key="title")
    expected = 4
    if result == expected:
        print(f"PASS: binary_search finds value at last index")
    else:
        print(f"FAIL: binary_search finds value at last index — expected {expected}, got {result}")
    
    # Test middle index
    result = binary_search(records, "Task C", key="title")
    expected = 2
    if result == expected:
        print(f"PASS: binary_search finds value at middle index")
    else:
        print(f"FAIL: binary_search finds value at middle index — expected {expected}, got {result}")

def test_binary_search_not_found():
    records = [
        {"title": "Task A"},
        {"title": "Task B"},
        {"title": "Task C"}
    ]
    result = binary_search(records, "Task Z", key="title")
    expected = -1
    if result == expected:
        print(f"PASS: binary_search returns not-found result")
    else:
        print(f"FAIL: binary_search returns not-found result — expected {expected}, got {result}")

def test_insertion_sort_count_sorted_and_positive():
    records = [{"title": "Task C"}, {"title": "Task A"}, {"title": "Task B"}]
    count = insertion_sort_count(records, key="title")
    expected_sorted = [{"title": "Task A"}, {"title": "Task B"}, {"title": "Task C"}]
    if records == expected_sorted and isinstance(count, int) and count > 0:
        print(f"PASS: insertion_sort_count sorts list and returns positive int")
    else:
        print(f"FAIL: insertion_sort_count — sorted: {records == expected_sorted}, count: {count} (type: {type(count)}, >0: {count > 0 if isinstance(count, int) else 'N/A'})")

def test_binary_search_count_known_index():
    records = [
        {"title": "Task A"},
        {"title": "Task B"},
        {"title": "Task C"},
        {"title": "Task D"}
    ]
    result = binary_search_count(records, "Task C", key="title")
    expected_index = 2
    if result["index"] == expected_index and isinstance(result["comparison_count"], int) and result["comparison_count"] > 0:
        print(f"PASS: binary_search_count returns correct index and positive comparison count")
    else:
        print(f"FAIL: binary_search_count — index: {result['index']} (expected {expected_index}), count: {result['comparison_count']} (type: {type(result['comparison_count'])}, >0: {result['comparison_count'] > 0 if isinstance(result['comparison_count'], int) else 'N/A'})")

def test_linear_search_count_absent():
    records = [
        {"title": "Task A"},
        {"title": "Task B"},
        {"title": "Task C"}
    ]
    result = linear_search_count(records, "Task Z", key="title")
    expected_index = -1
    expected_count = len(records)
    if result["index"] == expected_index and result["comparison_count"] == expected_count:
        print(f"PASS: linear_search_count returns correct index and comparison count for absent value")
    else:
        print(f"FAIL: linear_search_count — index: {result['index']} (expected {expected_index}), count: {result['comparison_count']} (expected {expected_count})")

if __name__ == "__main__":
    test_insertion_sort_empty()
    test_insertion_sort_single()
    test_binary_search_found()
    test_binary_search_not_found()
    test_insertion_sort_count_sorted_and_positive()
    test_binary_search_count_known_index()
    test_linear_search_count_absent()