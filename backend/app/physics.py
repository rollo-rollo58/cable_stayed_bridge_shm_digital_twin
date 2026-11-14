"""Transparent, dimensionally annotated structural-response research calculations."""
from __future__ import annotations

import math


def engineering_stress_mpa(strain_micro: float, modulus_gpa: float = 200.0) -> float:
    """Return linear elastic stress in MPa from microstrain and modulus in GPa."""
    if modulus_gpa <= 0.0 or not math.isfinite(modulus_gpa):
        raise ValueError("elastic modulus must be finite and positive")
    if not math.isfinite(strain_micro):
        raise ValueError("strain must be finite")
    return strain_micro * 1e-6 * modulus_gpa * 1000.0


def tension_from_mode_kn(frequency_hz: float, length_m: float, kg_per_m: float) -> float:
    """Ideal pinned-string first-mode estimate: 4 mu L^2 f^2 / 1000."""
    if not all(math.isfinite(v) and v > 0 for v in (frequency_hz, length_m, kg_per_m)):
        raise ValueError("frequency, length, and line mass must be positive")
    return 4.0 * kg_per_m * length_m * length_m * frequency_hz**2 / 1000.0


def thermal_movement_mm(
    length_m: float,
    temperature_delta_c: float,
    alpha_per_c: float = 12e-6,
) -> float:
    if length_m <= 0.0 or alpha_per_c <= 0.0:
        raise ValueError("length and expansion coefficient must be positive")
    return length_m * 1000.0 * alpha_per_c * temperature_delta_c


def modal_shift_percent(measured_hz: float, baseline_hz: float) -> float:
    if baseline_hz <= 0.0 or measured_hz <= 0.0:
        raise ValueError("frequencies must be positive")
    return 100.0 * abs(measured_hz - baseline_hz) / baseline_hz


def damped_amplitude(initial: float, zeta: float, frequency_hz: float, time_s: float) -> float:
    if not 0.0 <= zeta < 1.0 or frequency_hz <= 0.0 or time_s < 0.0:
        raise ValueError("invalid decay parameters")
    return initial * math.exp(-zeta * 2.0 * math.pi * frequency_hz * time_s)


def miner_damage(cycles: int, range_mpa: float, detail_constant: float = 2e12) -> float:
    """Illustrative damage = n sigma^3 / C, not a code-compliant detail category."""
    if cycles < 0 or range_mpa < 0.0 or detail_constant <= 0.0:
        raise ValueError("invalid fatigue inputs")
    return cycles * range_mpa**3 / detail_constant


def cable_frequency_hz(tension_kn: float, length_m: float, kg_per_m: float) -> float:
    if min(tension_kn, length_m, kg_per_m) <= 0.0:
        raise ValueError("cable properties must be positive")
    return math.sqrt(tension_kn * 1000.0 / (4.0 * kg_per_m * length_m**2))
