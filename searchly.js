function setupSearchly(searchInputId) {
    const searchInput = document.getElementById(searchInputId);

    if (!searchInput) {
        console.error(`Searchly: Zoekveld met ID "${searchInputId}" niet gevonden.`);
        return;
    }

    // 1. Voorkom standaard formulier indiening EN open overlay
    const form = searchInput.closest('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Voorkomt standaard indiening van het formulier
            // Gebruik de waarde van het zoekveld voor de overlay
            openFullscreenOverlay(newInput.value.trim());
            // Optioneel: sluit de dropdown als deze open is bij het indienen
            container.style.display = 'none';
        }, true); // Gebruik `true` voor capturing phase om eerder af te vangen
    }

    // 2. Vervang input voor frisse event listeners
    const newInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newInput, searchInput);

    // 3. Maak container voor web component (popup-style)
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = '9999';
    container.style.background = 'white';
    container.style.border = '1px solid #ccc';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    container.style.display = 'none';
    container.style.minWidth = newInput.offsetWidth + 'px';
    container.id = `searchly-dropdown-${searchInputId}`;

    // 4. Voeg de searchly-main toe
    const searchlyMain = document.createElement('searchly-main');
    searchlyMain.setAttribute('q', '');
    container.appendChild(searchlyMain);
    document.body.appendChild(container);

    // 5. Laad het component script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://start-plum_jek_tono_porkins_naval_chimpanzee.toddle.site/.toddle/custom-element/searchly-main.js';
    script.onerror = () => {
        console.error('Searchly: Fout bij het laden van het searchly-main webcomponent script.');
        container.remove();
        newInput.replaceWith(searchInput);
    };
    document.body.appendChild(script);

    // 6. Repositioneer dropdown onder input
    function positionDropdown() {
        if (container.style.display === 'none') return;
        const rect = newInput.getBoundingClientRect();
        container.style.top = rect.bottom + window.scrollY + 'px';
        container.style.left = rect.left + window.scrollX + 'px';
        container.style.minWidth = rect.width + 'px';
    }

    // 7. Input handler (voor de dropdown)
    newInput.addEventListener('input', () => {
        const query = newInput.value.trim();
        searchlyMain.setAttribute('q', query);

        if (query.length < 2) {
            container.style.display = 'none';
        } else {
            positionDropdown();
            container.style.display = 'block';
        }
    });

    // 8. Open Fullscreen Overlay functie
    function openFullscreenOverlay(query) {
        if (document.getElementById('searchly-fullscreen-overlay')) {
            document.querySelector('#searchly-fullscreen-overlay searchly-main').setAttribute('q', query);
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'searchly-fullscreen-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'white';
        overlay.style.zIndex = '10000';
        overlay.style.overflow = 'auto';
        overlay.style.padding = '2rem';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'center';

        const searchlyMainOverlay = document.createElement('searchly-main');
        searchlyMainOverlay.setAttribute('q', query);

        // Voeg een sluitknop toe aan de overlay voor de gebruiker
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Sluiten';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '1rem';
        closeButton.style.right = '1rem';
        closeButton.style.zIndex = '10001'; // Zorg dat de knop boven de overlay ligt
        closeButton.style.padding = '0.5rem 1rem';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });

        searchlyMainOverlay.addEventListener('close-overlay', () => {
            overlay.remove();
        });

        overlay.appendChild(closeButton); // Voeg de sluitknop toe
        overlay.appendChild(searchlyMainOverlay);
        document.body.appendChild(overlay);
    }

    // 9. Keydown handler (Enter-toets) - deze roept ook de overlay aan
    newInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            openFullscreenOverlay(newInput.value.trim());
        }
    });

    // 10. Klik buiten sluit de dropdown
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && e.target !== newInput) {
            container.style.display = 'none';
        }
    });

    // 11. Automatisch herpositioneren bij scroll of resize
    window.addEventListener('scroll', positionDropdown);
    window.addEventListener('resize', positionDropdown);
}

// setupSearchly('zoekbalk');