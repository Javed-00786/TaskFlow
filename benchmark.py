import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from algorithms import insertion_sort_count, binary_search_count, linear_search_count
import random

def generate_tasks(n, prefix="Task"):
    """Generate a list of task dictionaries with title, priority, due_date."""
    tasks = []
    priorities = ["low", "medium", "high"]
    weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    
    for i in range(n):
        title = f"{prefix} {i+1}"
        priority = random.choice(priorities)
        # Randomly assign a due_date hint sometimes
        if random.random() < 0.3:
            due_date = random.choice(weekdays[:5])  # Monday to Friday
        else:
            due_date = None
        tasks.append({
            "title": title,
            "priority": priority,
            "due_date": due_date
        })
    return tasks

def main():
    sizes = [10, 500, 3000]
    results = {}
    
    for size in sizes:
        print(f"Generating {size} tasks...")
        tasks = generate_tasks(size)
        
        # Make a copy for each algorithm
        tasks_for_insertion = tasks.copy()
        count_insertion = insertion_sort_count(tasks_for_insertion, key="title")
        results[f"insertion_sort_count_{size}"] = count_insertion
        
        # Sort tasks by title for binary search
        tasks_sorted = sorted(tasks, key=lambda x: x["title"])
        
        # Binary search: look for a title that exists (first item) and one that doesn't
        target_existing = tasks_sorted[0]["title"]
        target_missing = "NonExistentTask"
        
        result_binary_existing = binary_search_count(tasks_sorted, target_existing, key="title")
        result_binary_missing = binary_search_count(tasks_sorted, target_missing, key="title")
        
        results[f"binary_search_count_{size}_existing"] = result_binary_existing
        results[f"binary_search_count_{size}_missing"] = result_binary_missing
        
        # Linear search: same targets
        result_linear_existing = linear_search_count(tasks, target_existing, key="title")
        result_linear_missing = linear_search_count(tasks, target_missing, key="title")
        
        results[f"linear_search_count_{size}_existing"] = result_linear_existing
        results[f"linear_search_count_{size}_missing"] = result_linear_missing
    
    # Save results to a file
    with open("benchmark_results.txt", "w") as f:
        for key, value in results.items():
            f.write(f"{key}: {value}\n")
    
    print("Benchmark results saved to benchmark_results.txt")
    for key, value in results.items():
        print(f"{key}: {value}")

if __name__ == "__main__":
    main()