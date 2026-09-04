// ==========================================================
// ELEMENTOS DO DASHBOARD
// ==========================================================

const newAnalysisButton = document.querySelector(".welcome button");
const analysisCount = document.getElementById("analysisCount");
const activityList = document.querySelector(".activity-list");
const alertList = document.querySelector(".alert-list");

const searchInput =
    document.getElementById("search") ||
    document.querySelector(".search input");

const searchResults =
    document.getElementById("searchResults") ||
    document.querySelector(".search-results");

const sidebarLinks = document.querySelectorAll("aside a");

// ==========================================================
// SISTEMA DE TOAST (NOTIFICAÇÕES FLUTUANTES)
// ==========================================================

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    let iconName = "info";

    if (type === "success") {
        iconName = "check-circle";
    }

    if (type === "error") {
        iconName = "alert-triangle";
    }

    toast.innerHTML = `
        <i
            data-lucide="${iconName}"
            style="
                width: 18px;
                height: 18px;
                color: ${
                    type === "success"
                        ? "#10B981"
                        : type === "error"
                        ? "#EF4444"
                        : "#2563EB"
                };
                flex-shrink: 0;
            "
        ></i>

        <span>${message}</span>
    `;

    container.appendChild(toast);

    if (window.lucide) {
        lucide.createIcons();
    }

    setTimeout(() => {
        toast.style.animation =
            "fadeOut 0.3s ease forwards";

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// ==========================================================
// SISTEMA DE TEMA — CLARO / ESCURO
// ==========================================================

const themeToggleBtn =
    document.getElementById("themeToggleBtn");

function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle(
        "light-theme",
        isLight
    );

    localStorage.setItem(
        "cybershield-theme",
        isLight ? "light" : "dark"
    );

    // ======================================================
    // ATUALIZAR BOTÃO DO MENU DE PERFIL
    // ======================================================

    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = isLight
            ? '<i data-lucide="sun"></i><span>Modo escuro</span>'
            : '<i data-lucide="moon"></i><span>Modo claro</span>';
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==========================================================
// TROCAR TEMA PELO MENU DO PERFIL
// ==========================================================

if (themeToggleBtn) {
    themeToggleBtn.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );

            applyTheme(
                isLight ? "dark" : "light"
            );

            const profile =
                document.querySelector(".profile");

            if (profile) {
                profile.classList.remove(
                    "active"
                );
            }

            showToast(
                isLight
                    ? "Modo escuro ativado"
                    : "Modo claro ativado",
                "info"
            );
        }
    );
}

// ==========================================================
// CARREGAR TEMA SALVO
// ==========================================================

const savedTheme =
    localStorage.getItem(
        "cybershield-theme"
    ) || "dark";

applyTheme(savedTheme);

// ==========================================================
// LIMITAR ATIVIDADES E ALERTAS
// ==========================================================

function limitActivities() {
    if (!activityList) return;

    const activities =
        activityList.querySelectorAll(
            ".activity-item"
        );

    activities.forEach(
        (activity, index) => {
            if (index >= 5) {
                activity.remove();
            }
        }
    );
}

function limitAlerts() {
    if (!alertList) return;

    const alerts =
        alertList.querySelectorAll(
            ".alert-item"
        );

    alerts.forEach(
        (alert, index) => {
            if (index >= 5) {
                alert.remove();
            }
        }
    );
}

// ==========================================================
// ADICIONAR ATIVIDADE
// ==========================================================

function addActivity() {
    if (!activityList) return;

    const activity =
        document.createElement("div");

    activity.classList.add(
        "activity-item"
    );

    activity.setAttribute(
        "data-searchable",
        ""
    );

    activity.setAttribute(
        "data-search-section",
        "Atividade recente"
    );

    activity.id =
        `activity-${Date.now()}`;

    activity.innerHTML = `
        <div class="activity-icon">
            <i data-lucide="scan-search"></i>
        </div>

        <div class="activity-info">
            <strong>
                Nova análise realizada
            </strong>

            <span>
                Análise de segurança concluída
            </span>
        </div>

        <time
            style="
                color: #9CA3AF;
                font-size: 12px;
            "
        >
            Agora
        </time>
    `;

    activityList.prepend(activity);

    limitActivities();

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==========================================================
// ADICIONAR ALERTA
// ==========================================================

function addAlert() {
    if (!alertList) return;

    const alert =
        document.createElement("div");

    alert.classList.add(
        "alert-item"
    );

    alert.setAttribute(
        "data-searchable",
        ""
    );

    alert.setAttribute(
        "data-search-section",
        "Alertas"
    );

    alert.id =
        `alert-${Date.now()}`;

    alert.innerHTML = `
        <div class="alert-icon">
            <i data-lucide="shield-alert"></i>
        </div>

        <div class="alert-info">
            <strong>
                Vulnerabilidade encontrada
            </strong>

            <span>
                Uma possível falha foi identificada.
            </span>
        </div>

        <span
            class="alert-level"
            style="
                color: #EF4444;
                font-weight: 600;
                font-size: 12px;
            "
        >
            Alto
        </span>
    `;

    alertList.prepend(alert);

    limitAlerts();

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ==========================================================
// FUNÇÕES DE BUSCA INTELIGENTE
// ==========================================================

function getSearchIcon(element) {
    const icon =
        element.querySelector(
            "[data-lucide]"
        );

    return icon
        ? icon.getAttribute(
              "data-lucide"
          )
        : "search";
}

function getSection(element) {
    if (element.closest(".stats")) {
        return "Estatísticas";
    }

    if (
        element.closest(
            ".recent-activity"
        )
    ) {
        return "Atividade recente";
    }

    if (element.closest(".alerts")) {
        return "Alertas";
    }

    if (element.closest(".devices")) {
        return "Dispositivos";
    }

    return "Dashboard";
}

function getDescription(element) {
    const text =
        element.textContent
            .replace(/\s+/g, " ")
            .trim();

    return text.substring(0, 90);
}

function getSearchData() {
    const elements =
        document.querySelectorAll(
            "[data-searchable]"
        );

    const data = [];

    elements.forEach(
        (element) => {
            if (!element.id) {
                element.id =
                    `search-item-${data.length}`;
            }

            const titleElement =
                element.querySelector(
                    "strong, span"
                );

            const title =
                titleElement
                    ? titleElement.textContent.trim()
                    : element.textContent.substring(
                          0,
                          40
                      );

            const section =
                element.getAttribute(
                    "data-search-section"
                ) ||
                getSection(element);

            data.push({
                title: title,
                section: section,
                description:
                    getDescription(
                        element
                    ),
                target:
                    `#${element.id}`,
                icon:
                    getSearchIcon(
                        element
                    )
            });
        }
    );

    return data;
}

function showSearchResults() {
    if (
        !searchInput ||
        !searchResults
    ) {
        return;
    }

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    if (searchText === "") {
        searchResults.innerHTML = "";

        searchResults.hidden = true;

        return;
    }

    const searchData =
        getSearchData();

    const results =
        searchData.filter(
            (item) => {
                const text =
                    `${item.title} ${item.section} ${item.description}`
                        .toLowerCase();

                return text.includes(
                    searchText
                );
            }
        );

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div
                class="search-empty"
                style="
                    padding: 12px 16px;
                    color: #9CA3AF;
                    font-size: 13px;
                "
            >
                Nenhum resultado encontrado
            </div>
        `;

        searchResults.hidden = false;

        return;
    }

    searchResults.innerHTML =
        results
            .map(
                (item, index) => `
                    <button
                        type="button"
                        class="search-result"
                        data-result-index="${index}"
                    >
                        <span class="search-result-icon">
                            <i
                                data-lucide="${item.icon}"
                            ></i>
                        </span>

                        <span class="search-result-content">
                            <strong>
                                ${item.title}
                            </strong>

                            <small>
                                ${item.section}
                                ·
                                ${item.description}
                            </small>
                        </span>
                    </button>
                `
            )
            .join("");

    searchResults.hidden = false;

    if (window.lucide) {
        lucide.createIcons();
    }

    searchResults
        .querySelectorAll(
            ".search-result"
        )
        .forEach(
            (button) => {
                button.addEventListener(
                    "click",
                    () => {
                        const index =
                            Number(
                                button
                                    .dataset
                                    .resultIndex
                            );

                        openSearchResult(
                            results[index]
                        );
                    }
                );
            }
        );
}

function openSearchResult(result) {
    const target =
        document.querySelector(
            result.target
        );

    if (!target) return;

    if (searchResults) {
        searchResults.hidden = true;
    }

    if (searchInput) {
        searchInput.value = "";
    }

    target.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    target.classList.add(
        "search-highlight"
    );

    setTimeout(() => {
        target.classList.remove(
            "search-highlight"
        );
    }, 2000);
}

// ==========================================================
// FILTROS DE ALERTAS
// ==========================================================

const filterButtons =
    document.querySelectorAll(
        ".btn-filter"
    );

filterButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                filterButtons.forEach(
                    (btn) => {
                        btn.classList.remove(
                            "active"
                        );

                        btn.style.background =
                            "#1F2937";

                        btn.style.color =
                            "#9CA3AF";

                        btn.style.borderColor =
                            "#374151";
                    }
                );

                button.classList.add(
                    "active"
                );

                button.style.background =
                    "#2563EB";

                button.style.color =
                    "#FFFFFF";

                button.style.borderColor =
                    "transparent";

                const filterValue =
                    button.getAttribute(
                        "data-filter"
                    );

                document
                    .querySelectorAll(
                        ".alert-item"
                    )
                    .forEach(
                        (item) => {
                            const levelElement =
                                item.querySelector(
                                    ".alert-level"
                                );

                            const levelText =
                                levelElement
                                    ? levelElement.textContent.trim()
                                    : "";

                            if (
                                filterValue ===
                                    "all" ||
                                levelText ===
                                    filterValue
                            ) {
                                item.style.display =
                                    "flex";
                            } else {
                                item.style.display =
                                    "none";
                            }
                        }
                    );
            }
        );
    }
);

// ==========================================================
// EXPORTAÇÃO REAL DE RELATÓRIO (CSV)
// ==========================================================

const exportReportBtn =
    document.getElementById(
        "exportReportBtn"
    );

if (exportReportBtn) {
    exportReportBtn.addEventListener(
        "click",
        () => {
            exportReportBtn.disabled =
                true;

            exportReportBtn.innerHTML = `
                <i data-lucide="loader"></i>
                Gerando Relatório...
            `;

            if (window.lucide) {
                lucide.createIcons();
            }

            setTimeout(() => {
                let csvContent =
                    "data:text/csv;charset=utf-8,Tipo,Titulo,Detalhes\n";

                document
                    .querySelectorAll(
                        ".alert-item"
                    )
                    .forEach(
                        (item) => {
                            const title =
                                item.querySelector(
                                    "strong"
                                )?.textContent ||
                                "";

                            const desc =
                                item.querySelector(
                                    "span"
                                )?.textContent ||
                                "";

                            csvContent +=
                                `Alerta,"${title}","${desc}"\n`;
                        }
                    );

                const encodedUri =
                    encodeURI(
                        csvContent
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.setAttribute(
                    "href",
                    encodedUri
                );

                link.setAttribute(
                    "download",
                    `relatorio_seguranca_${Date.now()}.csv`
                );

                document.body.appendChild(
                    link
                );

                link.click();

                document.body.removeChild(
                    link
                );

                exportReportBtn.innerHTML = `
                    <i data-lucide="check"></i>
                    Relatório Exportado!
                `;

                exportReportBtn.style.background =
                    "#059669";

                showToast(
                    "Relatório baixado com sucesso em formato CSV!",
                    "success"
                );

                if (window.lucide) {
                    lucide.createIcons();
                }

                setTimeout(() => {
                    exportReportBtn.disabled =
                        false;

                    exportReportBtn.innerHTML = `
                        <i data-lucide="file-text"></i>
                        Exportar Relatório (CSV)
                    `;

                    exportReportBtn.style.background =
                        "#2563EB";

                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }, 3000);
            }, 1500);
        }
    );
}

// ==========================================================
// EVENTOS GLOBAIS E INICIALIZAÇÃO
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {
        limitActivities();

        limitAlerts();

        if (searchInput) {
            searchInput.addEventListener(
                "input",
                showSearchResults
            );
        }

        const profile =
            document.querySelector(
                ".profile"
            );

        if (profile) {
            profile.addEventListener(
                "click",
                (event) => {
                    event.stopPropagation();

                    profile.classList.toggle(
                        "active"
                    );
                }
            );
        }
    }
);

document.addEventListener(
    "click",
    (event) => {
        if (
            !event.target.closest(
                ".search"
            ) &&
            searchResults
        ) {
            searchResults.hidden = true;
        }

        const profile =
            document.querySelector(
                ".profile"
            );

        if (profile) {
            profile.classList.remove(
                "active"
            );
        }
    }
);

// ==========================================================
// CONTROLE DO MODAL DE PERFIL
// ==========================================================

const profileModal =
    document.getElementById(
        "profileModal"
    );

const openProfileButton =
    document.querySelector(
        ".profile-menu a:first-child"
    );

const closeModalButton =
    document.getElementById(
        "closeModal"
    );

const saveModalButton =
    document.getElementById(
        "saveModal"
    );

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );

if (
    openProfileButton &&
    profileModal
) {
    openProfileButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            profileModal.hidden = false;

            const profileContainer =
                document.querySelector(
                    ".profile"
                );

            if (profileContainer) {
                profileContainer.classList.remove(
                    "active"
                );
            }

            if (window.lucide) {
                lucide.createIcons();
            }
        }
    );
}

function closeModal() {
    if (profileModal) {
        profileModal.hidden = true;
    }
}

if (closeModalButton) {
    closeModalButton.addEventListener(
        "click",
        closeModal
    );
}

if (saveModalButton) {
    saveModalButton.addEventListener(
        "click",
        closeModal
    );
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener(
        "click",
        () => {
            changePasswordBtn.textContent =
                "Redefinição enviada ao e-mail!";

            changePasswordBtn.style.color =
                "#34D399";

            showToast(
                "E-mail de redefinição de senha enviado.",
                "info"
            );

            setTimeout(() => {
                changePasswordBtn.innerHTML = `
                    <i data-lucide="key"></i>
                    Modificar Senha de Acesso
                `;

                changePasswordBtn.style.color =
                    "";

                if (window.lucide) {
                    lucide.createIcons();
                }
            }, 3000);
        }
    );
}

if (profileModal) {
    profileModal.addEventListener(
        "click",
        (event) => {
            if (
                event.target ===
                profileModal
            ) {
                closeModal();
            }
        }
    );
}

// ==========================================================
// NOVA ANÁLISE
// ==========================================================

if (newAnalysisButton) {
    newAnalysisButton.addEventListener(
        "click",
        () => {
            newAnalysisButton.textContent =
                "Analisando...";

            newAnalysisButton.disabled =
                true;

            setTimeout(() => {
                if (analysisCount) {
                    analysisCount.textContent =
                        Number(
                            analysisCount.textContent ||
                                0
                        ) + 1;
                }

                addActivity();

                addAlert();

                showToast(
                    "Nova análise concluída com novas ocorrências.",
                    "success"
                );

                newAnalysisButton.textContent =
                    "Análise concluída";

                setTimeout(() => {
                    newAnalysisButton.textContent =
                        "Nova Análise";

                    newAnalysisButton.disabled =
                        false;
                }, 1000);
            }, 2000);
        }
    );
}