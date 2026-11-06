# pytest exits 5 when it collects no tests; that is green for an empty suite.
PYTEST = uv run pytest
OK_IF_EMPTY = || [ $$? -eq 5 ]

.PHONY: test unit integration lint live-check

test: unit integration

unit:
	$(PYTEST) tests/unit $(OK_IF_EMPTY)

integration:
	$(PYTEST) tests/integration $(OK_IF_EMPTY)

lint:
	uv run ruff check .

# Is the local Switch Console stack up? (read-only)
live-check:
	scripts/live-check.sh
